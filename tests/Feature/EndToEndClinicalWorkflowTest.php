<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Branch;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\WaitingQueue;
use App\Models\Consultation;
use App\Models\VitalSign;
use App\Models\Diagnosis;
use App\Models\Prescription;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class EndToEndClinicalWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected Clinic $clinic;
    protected Branch $branch;
    protected User $adminUser;
    protected User $doctorUser;
    protected Doctor $doctor;
    protected User $nurseUser;
    protected User $receptionistUser;
    protected User $accountantUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->clinic = Clinic::create([
            'name' => 'MediCore Clinic',
            'phone' => '+1 555-0100',
            'email' => 'contact@medicore.test',
            'address' => '123 Medical Center Way',
            'country' => 'Morocco',
            'currency' => 'MAD',
            'timezone' => 'UTC',
        ]);

        $this->branch = Branch::create([
            'clinic_id' => $this->clinic->id,
            'name' => 'Main Center',
            'code' => 'MAIN',
            'phone' => '+1 555-0100',
            'address' => '123 Medical Center Way',
            'is_main' => true,
            'is_active' => true,
        ]);

        $this->adminUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Dr. Director Admin',
            'email' => 'director@medicore.test',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->doctorUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Dr. Sarah Connor',
            'email' => 'sarah.connor@medicore.test',
            'password' => Hash::make('password123'),
            'role' => 'doctor',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->doctor = Doctor::create([
            'user_id' => $this->doctorUser->id,
            'branch_id' => $this->branch->id,
            'specialty' => 'general_practice',
            'license_number' => 'MED-12345',
            'consultation_fee' => 300.00,
            'follow_up_fee' => 150.00,
            'is_available' => true,
        ]);

        $this->nurseUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Nurse Jackie',
            'email' => 'nurse@medicore.test',
            'password' => Hash::make('password123'),
            'role' => 'nurse',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->receptionistUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Receptionist Alice',
            'email' => 'alice@medicore.test',
            'password' => Hash::make('password123'),
            'role' => 'receptionist',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->accountantUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Accountant Bob',
            'email' => 'bob@medicore.test',
            'password' => Hash::make('password123'),
            'role' => 'accountant',
            'locale' => 'en',
            'is_active' => true,
        ]);
    }

    public function test_complete_15_step_clinical_and_financial_lifecycle(): void
    {
        // -------------------------------------------------------------
        // STEP 1: Patient Registration (Receptionist)
        // -------------------------------------------------------------
        $patientData = [
            'first_name' => 'Tariq',
            'last_name' => 'Mansour',
            'gender' => 'male',
            'date_of_birth' => '1988-06-15',
            'blood_group' => 'O+',
            'phone' => '+212600112233',
            'email' => 'tariq.mansour@example.test',
            'national_id' => 'CIN-998877',
            'address' => '74 Boulevard Mohammed V',
            'city' => 'Casablanca',
        ];

        $regResponse = $this->actingAs($this->receptionistUser)
            ->post(route('patients.store'), $patientData);

        $regResponse->assertSessionHasNoErrors();
        $this->assertDatabaseHas('patients', [
            'first_name' => 'Tariq',
            'last_name' => 'Mansour',
            'phone' => '+212600112233',
            'national_id' => 'CIN-998877',
        ]);

        $patient = Patient::where('national_id', 'CIN-998877')->firstOrFail();
        $this->assertNotNull($patient->patient_uid);
        $this->assertStringStartsWith('PAT-', $patient->patient_uid);

        // -------------------------------------------------------------
        // STEP 2: Book Appointment (Receptionist)
        // -------------------------------------------------------------
        $appointmentDate = now()->addDay()->toDateString();
        $bookResponse = $this->actingAs($this->receptionistUser)
            ->post(route('appointments.store'), [
                'patient_id' => $patient->id,
                'doctor_id' => $this->doctor->id,
                'appointment_date' => $appointmentDate,
                'start_time' => '10:00:00',
                'end_time' => '10:30:00',
                'type' => 'consultation',
                'reason_for_visit' => 'Persistent migraine and elevated blood pressure',
            ]);

        $bookResponse->assertSessionHasNoErrors();
        $this->assertDatabaseHas('appointments', [
            'patient_id' => $patient->id,
            'doctor_id' => $this->doctor->id,
            'appointment_date' => $appointmentDate . ' 00:00:00',
            'status' => 'scheduled',
        ]);

        $appointment = Appointment::where('patient_id', $patient->id)->firstOrFail();

        // -------------------------------------------------------------
        // STEP 3: Patient Arrival Check-In (Receptionist marks arrival)
        // -------------------------------------------------------------
        $statusResponse = $this->actingAs($this->receptionistUser)
            ->patch(route('appointments.update-status', $appointment->id), [
                'status' => 'arrived',
            ]);

        $statusResponse->assertSessionHasNoErrors();
        $appointment->refresh();
        $this->assertEquals('arrived', $appointment->status);

        // -------------------------------------------------------------
        // STEP 4: Queue Check-In & Calling (Receptionist & Nurse)
        // -------------------------------------------------------------
        $queueResponse = $this->actingAs($this->receptionistUser)
            ->post(route('waiting-room.check-in'), [
                'patient_id' => $patient->id,
                'doctor_id' => $this->doctor->id,
                'appointment_id' => $appointment->id,
                'priority' => 'urgent',
                'notes' => 'Patient has throbbing headache',
            ]);

        $queueResponse->assertSessionHasNoErrors();
        $this->assertDatabaseHas('waiting_queue', [
            'patient_id' => $patient->id,
            'status' => 'waiting',
            'priority' => 'urgent',
        ]);

        $queueItem = WaitingQueue::where('patient_id', $patient->id)->firstOrFail();
        $this->assertEquals(1, $queueItem->queue_number);

        // Call next into doctor's operatory
        $callResponse = $this->actingAs($this->nurseUser)
            ->post(route('waiting-room.call', $queueItem->id));
        $callResponse->assertSessionHasNoErrors();

        $queueItem->refresh();
        $appointment->refresh();
        $this->assertEquals('called', $queueItem->status);
        $this->assertEquals('in_consultation', $appointment->status);

        // -------------------------------------------------------------
        // STEP 5: Open Clinical Consultation (Doctor)
        // -------------------------------------------------------------
        $consultResponse = $this->actingAs($this->doctorUser)
            ->post(route('consultations.store'), [
                'patient_id' => $patient->id,
                'doctor_id' => $this->doctor->id,
                'appointment_id' => $appointment->id,
                'chief_complaint' => 'Severe frontal cephalalgia lasting 3 days',
                'history_present_illness' => 'Patient reports visual aura, nausea, and sensitivity to light.',
                'physical_examination' => 'Neurological exam intact. No neck rigidity. Conjunctiva normal.',
                'clinical_assessment' => 'Migraine with aura, Stage 1 essential hypertension.',
                'treatment_plan' => 'Prescribe acute triptan therapy and initiate blood pressure monitoring.',
            ]);

        $consultResponse->assertSessionHasNoErrors();
        $consultation = Consultation::where('patient_id', $patient->id)->firstOrFail();
        $this->assertFalse((bool)$consultation->is_finalized);

        // -------------------------------------------------------------
        // STEP 6: Record Vital Signs (Nurse records, BMI calculated)
        // -------------------------------------------------------------
        $vitalsResponse = $this->actingAs($this->nurseUser)
            ->post(route('consultations.vitals', $consultation->id), [
                'systolic_bp' => 145,
                'diastolic_bp' => 92,
                'heart_rate' => 78,
                'respiratory_rate' => 16,
                'temperature' => 37.1,
                'oxygen_saturation' => 99,
                'weight' => 82.5,
                'height' => 178.0,
            ]);

        $vitalsResponse->assertSessionHasNoErrors();
        $vitalSign = VitalSign::where('consultation_id', $consultation->id)->firstOrFail();
        $this->assertEquals(145, $vitalSign->systolic_bp);
        $this->assertEquals(92, $vitalSign->diastolic_bp);
        // BMI = 82.5 / (1.78 * 1.78) = 26.0
        $this->assertEquals(26.0, $vitalSign->bmi);

        // -------------------------------------------------------------
        // STEP 7: Add Formal ICD-10 Diagnoses (Doctor)
        // -------------------------------------------------------------
        $diag1Response = $this->actingAs($this->doctorUser)
            ->post(route('consultations.diagnoses', $consultation->id), [
                'diagnosis_name' => 'Migraine with aura, intractable',
                'icd10_code' => 'G43.109',
                'type' => 'primary',
                'status' => 'active',
                'notes' => 'Recurrent episodic headache attacks',
            ]);
        $diag1Response->assertSessionHasNoErrors();

        $diag2Response = $this->actingAs($this->doctorUser)
            ->post(route('consultations.diagnoses', $consultation->id), [
                'diagnosis_name' => 'Essential (primary) hypertension',
                'icd10_code' => 'I10',
                'type' => 'secondary',
                'status' => 'active',
                'notes' => 'Stage 1 elevation',
            ]);
        $diag2Response->assertSessionHasNoErrors();

        $this->assertCount(2, Diagnosis::where('consultation_id', $consultation->id)->get());

        // -------------------------------------------------------------
        // STEP 8: Medical Notes Persistence Verification
        // -------------------------------------------------------------
        $consultation->refresh();
        $this->assertEquals('Severe frontal cephalalgia lasting 3 days', $consultation->chief_complaint);
        $this->assertEquals('Migraine with aura, Stage 1 essential hypertension.', $consultation->clinical_assessment);

        // -------------------------------------------------------------
        // STEP 9: Electronic Signature and Finalization (Doctor)
        // -------------------------------------------------------------
        $signResponse = $this->actingAs($this->doctorUser)
            ->post(route('consultations.sign', $consultation->id));
        $signResponse->assertSessionHasNoErrors();

        $consultation->refresh();
        $this->assertTrue((bool)$consultation->is_finalized);
        $this->assertNotNull($consultation->signed_at);
        $this->assertEquals($this->doctorUser->id, $consultation->signed_by);

        // Re-signing locked consultation must be rejected
        $resignResponse = $this->actingAs($this->doctorUser)
            ->post(route('consultations.sign', $consultation->id));
        $this->assertTrue((bool)$consultation->fresh()->is_finalized);

        // -------------------------------------------------------------
        // STEP 10: Issue Electronic Prescription (Doctor)
        // -------------------------------------------------------------
        $rxResponse = $this->actingAs($this->doctorUser)
            ->post(route('prescriptions.store'), [
                'patient_id' => $patient->id,
                'doctor_id' => $this->doctor->id,
                'consultation_id' => $consultation->id,
                'instructions' => 'Take sumatriptan at earliest onset of headache. Avoid tyramine-rich foods.',
                'items' => [
                    [
                        'medicine_name' => 'Sumatriptan 50mg Tablets',
                        'dosage' => '50 mg',
                        'route' => 'oral',
                        'frequency' => 'as_needed',
                        'duration' => '5 days',
                        'quantity' => 6,
                        'instructions' => 'Take 1 tablet at aura onset; repeat in 2 hours if migraine persists.',
                    ],
                    [
                        'medicine_name' => 'Amlodipine 5mg Tablets',
                        'dosage' => '5 mg',
                        'route' => 'oral',
                        'frequency' => 'once_daily',
                        'duration' => '30 days',
                        'quantity' => 30,
                        'instructions' => 'Take 1 tablet daily every morning with water.',
                    ]
                ],
            ]);

        $rxResponse->assertSessionHasNoErrors();
        $prescription = Prescription::where('consultation_id', $consultation->id)->firstOrFail();
        $this->assertCount(2, $prescription->items);

        // -------------------------------------------------------------
        // STEP 11: Generate Commercial Invoice (Accountant / Receptionist)
        // -------------------------------------------------------------
        $invoiceResponse = $this->actingAs($this->accountantUser)
            ->post(route('billing.store'), [
                'patient_id' => $patient->id,
                'due_date' => now()->toDateString(),
                'notes' => 'Specialist neurological consultation + diagnostic services',
                'items' => [
                    [
                        'item_name' => 'Specialist Medical Consultation',
                        'item_type' => 'consultation',
                        'quantity' => 1,
                        'unit_price' => 300.00,
                        'discount' => 0.00,
                        'tax_rate' => 10.00, // 300 + 30 = 330
                    ],
                    [
                        'item_name' => 'In-Clinic Vital Signs & ECG Screening',
                        'item_type' => 'procedure',
                        'quantity' => 1,
                        'unit_price' => 150.00,
                        'discount' => 20.00, // 130 + 13 = 143
                        'tax_rate' => 10.00,
                    ]
                ],
            ]);

        $invoiceResponse->assertSessionHasNoErrors();
        $invoice = Invoice::where('patient_id', $patient->id)->firstOrFail();

        // Subtotal: 300 + 150 = 450
        // Discount: 20
        // Tax: (300 * 0.10) + (130 * 0.10) = 30 + 13 = 43
        // Total Amount: (450 - 20) + 43 = 473.00
        $this->assertEquals(450.00, floatval($invoice->subtotal));
        $this->assertEquals(20.00, floatval($invoice->discount_amount));
        $this->assertEquals(43.00, floatval($invoice->tax_amount));
        $this->assertEquals(473.00, floatval($invoice->total_amount));
        $this->assertEquals(473.00, floatval($invoice->balance_due));
        $this->assertEquals('unpaid', $invoice->status);

        // -------------------------------------------------------------
        // STEP 12: Record Partial Payment (Accountant / Cashier)
        // -------------------------------------------------------------
        $payment1Response = $this->actingAs($this->accountantUser)
            ->post(route('billing.payment', $invoice->id), [
                'amount' => 200.00,
                'payment_method' => 'card',
                'transaction_reference' => 'POS-AUTH-987654',
                'notes' => 'Card deposit 200 MAD',
            ]);

        $payment1Response->assertSessionHasNoErrors();
        $invoice->refresh();
        $this->assertEquals(200.00, floatval($invoice->paid_amount));
        $this->assertEquals(273.00, floatval($invoice->balance_due));
        $this->assertEquals('partially_paid', $invoice->status);

        // -------------------------------------------------------------
        // STEP 13: Record Remaining Payment & Settle Invoice
        // -------------------------------------------------------------
        $payment2Response = $this->actingAs($this->accountantUser)
            ->post(route('billing.payment', $invoice->id), [
                'amount' => 273.00,
                'payment_method' => 'cash',
                'transaction_reference' => 'CASH-REC-001',
                'notes' => 'Full final cash settlement',
            ]);

        $payment2Response->assertSessionHasNoErrors();
        $invoice->refresh();
        $this->assertEquals(473.00, floatval($invoice->paid_amount));
        $this->assertEquals(0.00, floatval($invoice->balance_due));
        $this->assertEquals('paid', $invoice->status);
        $this->assertCount(2, $invoice->payments);

        // -------------------------------------------------------------
        // STEP 14: Printable Views Verification (Prescription & Invoice)
        // -------------------------------------------------------------
        $rxPrintResponse = $this->actingAs($this->doctorUser)
            ->get(route('prescriptions.print', $prescription->id));
        $rxPrintResponse->assertOk();

        $invoiceShowResponse = $this->actingAs($this->accountantUser)
            ->get(route('billing.show', $invoice->id));
        $invoiceShowResponse->assertOk();

        // -------------------------------------------------------------
        // STEP 15: Search Patient and Longitudinal Record Retrieval
        // -------------------------------------------------------------
        // Search by CIN
        $searchResponse = $this->actingAs($this->receptionistUser)
            ->get(route('patients.index', ['search' => 'CIN-998877']));
        $searchResponse->assertOk();

        // Retrieve full chart
        $chartResponse = $this->actingAs($this->doctorUser)
            ->get(route('patients.show', $patient->id));
        $chartResponse->assertOk();

        // Verify database integrity of complete lifecycle
        $this->assertDatabaseHas('patients', ['id' => $patient->id, 'national_id' => 'CIN-998877']);
        $this->assertDatabaseHas('appointments', ['id' => $appointment->id, 'status' => 'in_consultation']);
        $this->assertDatabaseHas('waiting_queue', ['patient_id' => $patient->id, 'status' => 'called']);
        $this->assertDatabaseHas('consultations', ['id' => $consultation->id, 'is_finalized' => 1]);
        $this->assertDatabaseHas('vital_signs', ['consultation_id' => $consultation->id, 'systolic_bp' => 145]);
        $this->assertDatabaseHas('diagnoses', ['consultation_id' => $consultation->id, 'icd10_code' => 'G43.109']);
        $this->assertDatabaseHas('prescriptions', ['id' => $prescription->id, 'status' => 'active']);
        $this->assertDatabaseHas('invoices', ['id' => $invoice->id, 'status' => 'paid', 'balance_due' => 0.00]);
        $this->assertDatabaseHas('payments', ['invoice_id' => $invoice->id, 'amount' => 200.00]);
        $this->assertDatabaseHas('payments', ['invoice_id' => $invoice->id, 'amount' => 273.00]);
    }
}
