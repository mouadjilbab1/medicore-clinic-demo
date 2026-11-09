<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Clinic;
use App\Models\Branch;
use App\Models\Department;
use App\Models\Room;
use App\Models\User;
use App\Models\Doctor;
use App\Models\DoctorSchedule;
use App\Models\Patient;
use App\Models\PatientAllergy;
use App\Models\Appointment;
use App\Models\WaitingQueue;
use App\Models\Consultation;
use App\Models\VitalSign;
use App\Models\Diagnosis;
use App\Models\DentalTooth;
use App\Models\DentalTreatment;
use App\Models\OphthalmologyRecord;
use App\Models\Prescription;
use App\Models\PrescriptionItem;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\InventoryProduct;
use App\Models\SpecialtyForm;
use App\Models\SpecialtyFormField;
use App\Models\SystemSetting;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Clinic
        $clinic = Clinic::create([
            'name' => 'MediCore Polyclinic & Diagnostic Center',
            'legal_name' => 'MediCore Healthcare Services SARL',
            'tax_number' => 'IF-48291039 / RC-2026',
            'phone' => '+212 522 998877',
            'email' => 'contact@medicore-clinic.com',
            'website' => 'https://medicore-clinic.com',
            'address' => '145 Boulevard d\'Anfa, 4ème Étage',
            'country' => 'Morocco',
            'timezone' => 'Africa/Casablanca',
            'currency' => 'MAD',
            'settings' => [
                'appointment_interval' => 30,
                'require_phone' => true,
                'enable_odontogram' => true,
                'enable_ophthalmology' => true,
                'enable_pediatrics' => true,
                'vat_percentage' => 0,
            ],
        ]);

        // 2. Branches
        $mainBranch = Branch::create([
            'clinic_id' => $clinic->id,
            'name' => 'Main Center - Anfa Casablanca',
            'code' => 'BRN-ANFA',
            'phone' => '+212 522 998877',
            'email' => 'anfa@medicore-clinic.com',
            'address' => '145 Boulevard d\'Anfa, Casablanca',
            'is_main' => true,
            'is_active' => true,
        ]);

        $northBranch = Branch::create([
            'clinic_id' => $clinic->id,
            'name' => 'North Satellite - Maarif',
            'code' => 'BRN-MAARIF',
            'phone' => '+212 522 334455',
            'email' => 'maarif@medicore-clinic.com',
            'address' => '72 Rue Jean Jaurès, Maarif, Casablanca',
            'is_main' => false,
            'is_active' => true,
        ]);

        // 3. Departments
        $generalDept = Department::create(['branch_id' => $mainBranch->id, 'name' => 'General Medicine', 'code' => 'GEN']);
        $dentalDept = Department::create(['branch_id' => $mainBranch->id, 'name' => 'Dental Surgery', 'code' => 'DENT']);
        $eyeDept = Department::create(['branch_id' => $mainBranch->id, 'name' => 'Ophthalmology', 'code' => 'OPHT']);
        $pedDept = Department::create(['branch_id' => $mainBranch->id, 'name' => 'Pediatrics', 'code' => 'PED']);
        $cardioDept = Department::create(['branch_id' => $mainBranch->id, 'name' => 'Cardiology', 'code' => 'CARD']);

        // 4. Rooms
        $room101 = Room::create(['branch_id' => $mainBranch->id, 'name' => 'Consultation Suite 1', 'room_number' => '101', 'type' => 'consultation', 'is_active' => true]);
        $roomDental = Room::create(['branch_id' => $mainBranch->id, 'name' => 'Dental Operatory A', 'room_number' => '102', 'type' => 'dental', 'is_active' => true]);
        $roomEye = Room::create(['branch_id' => $mainBranch->id, 'name' => 'Ophthalmology Exam Room', 'room_number' => '103', 'type' => 'procedure', 'is_active' => true]);
        $roomPed = Room::create(['branch_id' => $mainBranch->id, 'name' => 'Pediatric Care Unit', 'room_number' => '104', 'type' => 'consultation', 'is_active' => true]);

        // 5. System Administrator
        $admin = User::create([
            'branch_id' => $mainBranch->id,
            'name' => 'System Administrator',
            'email' => 'admin@medicore.local',
            'phone' => '+212 600 000001',
            'password' => Hash::make('admin123456'),
            'role' => 'admin',
            'locale' => 'ar',
            'is_active' => true,
        ]);

        // 6. Receptionist, Nurse, Accountant
        $receptionist = User::create([
            'branch_id' => $mainBranch->id,
            'name' => 'Fatima Zahra Mansouri',
            'email' => 'receptionist@medicore.local',
            'phone' => '+212 600 000002',
            'password' => Hash::make('receptionist123'),
            'role' => 'receptionist',
            'locale' => 'ar',
            'is_active' => true,
        ]);

        $nurse = User::create([
            'branch_id' => $mainBranch->id,
            'name' => 'Meryem Ouazzani',
            'email' => 'nurse@medicore.local',
            'phone' => '+212 600 000003',
            'password' => Hash::make('nurse123'),
            'role' => 'nurse',
            'locale' => 'fr',
            'is_active' => true,
        ]);

        $accountant = User::create([
            'branch_id' => $mainBranch->id,
            'name' => 'Adil Bennani',
            'email' => 'accountant@medicore.local',
            'phone' => '+212 600 000004',
            'password' => Hash::make('accountant123'),
            'role' => 'accountant',
            'locale' => 'fr',
            'is_active' => true,
        ]);

        // 7. Doctors
        $docGeneralUser = User::create([
            'branch_id' => $mainBranch->id,
            'name' => 'Dr. Youssef Alami',
            'email' => 'dr.alami@medicore.local',
            'phone' => '+212 661 112233',
            'password' => Hash::make('doctor123'),
            'role' => 'doctor',
            'locale' => 'ar',
            'is_active' => true,
        ]);
        $doctorGeneral = Doctor::create([
            'user_id' => $docGeneralUser->id,
            'specialty' => 'general',
            'license_number' => 'MD-CAS-2015-884',
            'qualifications' => 'MD, Internal Medicine, Faculty of Medicine Casablanca',
            'biography' => 'Specialist in internal medicine with over 12 years of clinical practice.',
            'consultation_fee' => 300.00,
            'followup_fee' => 150.00,
            'slot_duration_minutes' => 30,
            'commission_rate' => 20.00,
            'is_available' => true,
        ]);

        $docDentistUser = User::create([
            'branch_id' => $mainBranch->id,
            'name' => 'Dr. Sarah Bennani',
            'email' => 'dr.bennani@medicore.local',
            'phone' => '+212 661 445566',
            'password' => Hash::make('doctor123'),
            'role' => 'dentist',
            'locale' => 'fr',
            'is_active' => true,
        ]);
        $doctorDentist = Doctor::create([
            'user_id' => $docDentistUser->id,
            'specialty' => 'dental',
            'license_number' => 'DDS-CAS-2018-412',
            'qualifications' => 'Doctor of Dental Surgery, Endodontics & Cosmetic Dentistry',
            'biography' => 'Experienced dental surgeon specializing in restorative dentistry and implants.',
            'consultation_fee' => 350.00,
            'followup_fee' => 200.00,
            'slot_duration_minutes' => 45,
            'commission_rate' => 30.00,
            'is_available' => true,
        ]);

        $docEyeUser = User::create([
            'branch_id' => $mainBranch->id,
            'name' => 'Dr. Karim Idrissi',
            'email' => 'dr.idrissi@medicore.local',
            'phone' => '+212 661 778899',
            'password' => Hash::make('doctor123'),
            'role' => 'doctor',
            'locale' => 'ar',
            'is_active' => true,
        ]);
        $doctorEye = Doctor::create([
            'user_id' => $docEyeUser->id,
            'specialty' => 'ophthalmology',
            'license_number' => 'MD-OPH-2016-109',
            'qualifications' => 'Consultant Ophthalmologist & Refractive Surgeon',
            'biography' => 'Expert in optical correction, glaucoma assessment and retinal diagnostics.',
            'consultation_fee' => 400.00,
            'followup_fee' => 200.00,
            'slot_duration_minutes' => 30,
            'commission_rate' => 25.00,
            'is_available' => true,
        ]);

        // Weekly Schedules
        foreach ([$doctorGeneral, $doctorDentist, $doctorEye] as $doc) {
            for ($day = 1; $day <= 5; $day++) { // Monday to Friday
                DoctorSchedule::create([
                    'doctor_id' => $doc->id,
                    'branch_id' => $mainBranch->id,
                    'day_of_week' => $day,
                    'start_time' => '09:00:00',
                    'end_time' => '17:00:00',
                    'break_start' => '13:00:00',
                    'break_end' => '14:00:00',
                    'is_active' => true,
                ]);
            }
        }

        // 8. Patients
        $patient1 = Patient::create([
            'branch_id' => $mainBranch->id,
            'patient_uid' => 'PAT-2026-0001',
            'first_name' => 'Ahmed',
            'last_name' => 'El Amrani',
            'gender' => 'male',
            'date_of_birth' => '1984-06-15',
            'blood_group' => 'O+',
            'phone' => '+212 612 345678',
            'email' => 'ahmed.elamrani@example.com',
            'national_id' => 'BE589123',
            'address' => '45 Rue El Manar, Gauthier',
            'city' => 'Casablanca',
            'emergency_contact_name' => 'Khadija El Amrani (Spouse)',
            'emergency_contact_phone' => '+212 612 345679',
            'marital_status' => 'Married',
            'occupation' => 'Architect',
            'allergies_summary' => 'Penicillin (Severe anaphylactic shock risk)',
            'chronic_conditions_summary' => 'Hypertension (Diagnosed 2021)',
            'medical_notes' => 'Patient has compliance with anti-hypertensive regimen.',
            'is_active' => true,
        ]);

        PatientAllergy::create([
            'patient_id' => $patient1->id,
            'allergen' => 'Penicillin & Amoxicillin',
            'allergy_type' => 'drug',
            'severity' => 'life_threatening',
            'reaction' => 'Severe rash, angioedema and respiratory wheezing',
            'noted_at' => '2021-03-10',
        ]);

        $patient2 = Patient::create([
            'branch_id' => $mainBranch->id,
            'patient_uid' => 'PAT-2026-0002',
            'first_name' => 'Salma',
            'last_name' => 'Chafiq',
            'gender' => 'female',
            'date_of_birth' => '1992-11-20',
            'blood_group' => 'A+',
            'phone' => '+212 622 445566',
            'email' => 'salma.chafiq@example.com',
            'national_id' => 'BK994821',
            'address' => '12 Boulevard Zerktouni',
            'city' => 'Casablanca',
            'emergency_contact_name' => 'Omar Chafiq (Brother)',
            'emergency_contact_phone' => '+212 622 445567',
            'marital_status' => 'Single',
            'occupation' => 'Software Engineer',
            'allergies_summary' => 'None known',
            'chronic_conditions_summary' => 'Mild astigmatism',
            'medical_notes' => 'Routine dental and vision checkup scheduled.',
            'is_active' => true,
        ]);

        $patient3 = Patient::create([
            'branch_id' => $mainBranch->id,
            'patient_uid' => 'PAT-2026-0003',
            'first_name' => 'Tariq',
            'last_name' => 'Zouiten',
            'gender' => 'male',
            'date_of_birth' => '2018-04-10',
            'blood_group' => 'B+',
            'phone' => '+212 633 778899',
            'email' => 'zouiten.family@example.com',
            'national_id' => 'PED-7788',
            'address' => '88 Avenue Hassan II',
            'city' => 'Casablanca',
            'emergency_contact_name' => 'Nadia Zouiten (Mother)',
            'emergency_contact_phone' => '+212 633 778899',
            'marital_status' => 'Child',
            'allergies_summary' => 'Peanuts (Mild hives)',
            'chronic_conditions_summary' => 'None',
            'is_active' => true,
        ]);

        // 9. Appointments
        $today = now()->format('Y-m-d');

        $apt1 = Appointment::create([
            'branch_id' => $mainBranch->id,
            'patient_id' => $patient1->id,
            'doctor_id' => $doctorGeneral->id,
            'room_id' => $room101->id,
            'appointment_date' => $today,
            'start_time' => '09:30:00',
            'end_time' => '10:00:00',
            'type' => 'consultation',
            'status' => 'completed',
            'reason_for_visit' => 'Quarterly hypertension review & persistent tension headaches',
            'notes' => 'BP check requested.',
            'created_by' => $receptionist->id,
        ]);

        $apt2 = Appointment::create([
            'branch_id' => $mainBranch->id,
            'patient_id' => $patient2->id,
            'doctor_id' => $doctorDentist->id,
            'room_id' => $roomDental->id,
            'appointment_date' => $today,
            'start_time' => '10:30:00',
            'end_time' => '11:15:00',
            'type' => 'procedure',
            'status' => 'in_consultation',
            'reason_for_visit' => 'Severe acute pain in upper right quadrant (Tooth #16)',
            'notes' => 'Dental emergency slot.',
            'created_by' => $receptionist->id,
        ]);

        $apt3 = Appointment::create([
            'branch_id' => $mainBranch->id,
            'patient_id' => $patient3->id,
            'doctor_id' => $doctorGeneral->id,
            'room_id' => $room101->id,
            'appointment_date' => $today,
            'start_time' => '14:00:00',
            'end_time' => '14:30:00',
            'type' => 'follow_up',
            'status' => 'confirmed',
            'reason_for_visit' => 'Pediatric seasonal flu follow-up',
            'created_by' => $receptionist->id,
        ]);

        // 10. Waiting Queue
        WaitingQueue::create([
            'branch_id' => $mainBranch->id,
            'appointment_id' => $apt2->id,
            'patient_id' => $patient2->id,
            'doctor_id' => $doctorDentist->id,
            'queue_number' => 1,
            'priority' => 'urgent',
            'status' => 'in_consultation',
            'check_in_time' => now()->subMinutes(25),
            'called_time' => now()->subMinutes(10),
            'notes' => 'Acute toothache, called to Dental Operatory A.',
        ]);

        WaitingQueue::create([
            'branch_id' => $mainBranch->id,
            'patient_id' => $patient1->id,
            'doctor_id' => $doctorGeneral->id,
            'queue_number' => 2,
            'priority' => 'normal',
            'status' => 'completed',
            'check_in_time' => now()->subHours(2),
            'called_time' => now()->subHours(2)->addMinutes(5),
            'completed_time' => now()->subHours(1)->addMinutes(30),
            'notes' => 'Consultation completed.',
        ]);

        // 11. Consultation & Clinical Records for Patient 1
        $consultation1 = Consultation::create([
            'appointment_id' => $apt1->id,
            'patient_id' => $patient1->id,
            'doctor_id' => $doctorGeneral->id,
            'branch_id' => $mainBranch->id,
            'consultation_date' => now()->subHours(2),
            'chief_complaint' => 'Bilateral throbbing headache and mild dizziness over the past 4 days.',
            'history_present_illness' => 'Patient reports gradual onset of occipital headache, worse in morning. Admits missing two doses of prescribed Amlodipine during work travel last week.',
            'physical_examination' => 'Patient is alert, well-oriented. Heart sounds S1/S2 regular, no murmurs. Chest clear to auscultation bilaterally. Neurological exam grossly intact.',
            'clinical_assessment' => 'Uncontrolled essential hypertension with secondary tension-type headache.',
            'treatment_plan' => '1. Reinforce daily medication compliance.\n2. Resume Amlodipine 5mg morning.\n3. Add Candesartan 8mg once daily.\n4. Low-sodium dietary counselling.',
            'follow_up_instructions' => 'Return in 14 days with 7-day home blood pressure self-monitoring log.',
            'follow_up_date' => now()->addDays(14)->format('Y-m-d'),
            'is_finalized' => true,
            'signed_at' => now()->subHour(),
            'signed_by' => $docGeneralUser->id,
        ]);

        VitalSign::create([
            'consultation_id' => $consultation1->id,
            'patient_id' => $patient1->id,
            'recorded_by' => $nurse->id,
            'systolic_bp' => 152,
            'diastolic_bp' => 96,
            'heart_rate' => 78,
            'respiratory_rate' => 16,
            'temperature' => 36.8,
            'oxygen_saturation' => 99,
            'weight' => 84.50,
            'height' => 178.00,
            'bmi' => 26.7,
            'recorded_at' => now()->subHours(2),
        ]);

        Diagnosis::create([
            'consultation_id' => $consultation1->id,
            'patient_id' => $patient1->id,
            'icd10_code' => 'I10',
            'diagnosis_name' => 'Essential (primary) hypertension',
            'type' => 'primary',
            'status' => 'active',
            'notes' => 'Currently sub-optimally controlled.',
        ]);

        Diagnosis::create([
            'consultation_id' => $consultation1->id,
            'patient_id' => $patient1->id,
            'icd10_code' => 'G44.2',
            'diagnosis_name' => 'Tension-type headache',
            'type' => 'secondary',
            'status' => 'active',
        ]);

        // Prescription for Patient 1
        $prescription1 = Prescription::create([
            'consultation_id' => $consultation1->id,
            'patient_id' => $patient1->id,
            'doctor_id' => $doctorGeneral->id,
            'prescription_number' => 'RX-2026-0001',
            'status' => 'active',
            'instructions' => 'Take with water every morning with breakfast. Monitor BP regularly.',
            'signed_at' => now()->subHour(),
        ]);

        PrescriptionItem::create([
            'prescription_id' => $prescription1->id,
            'medicine_name' => 'Amlodipine (Norvasc) 5mg Tablets',
            'dosage' => '5mg',
            'frequency' => 'Once daily (Morning)',
            'duration' => '30 Days',
            'route' => 'oral',
            'quantity' => 1,
            'instructions' => 'Take after breakfast',
        ]);

        PrescriptionItem::create([
            'prescription_id' => $prescription1->id,
            'medicine_name' => 'Candesartan (Atacand) 8mg Tablets',
            'dosage' => '8mg',
            'frequency' => 'Once daily (Morning)',
            'duration' => '30 Days',
            'route' => 'oral',
            'quantity' => 1,
            'instructions' => 'Take concurrently with Amlodipine',
        ]);

        // 12. Dental Odontogram data for Patient 2
        DentalTooth::create([
            'patient_id' => $patient2->id,
            'tooth_number' => 16, // Upper Right First Molar
            'surface_occlusal' => 'caries',
            'surface_mesial' => 'caries',
            'surface_distal' => 'healthy',
            'surface_buccal' => 'healthy',
            'surface_lingual' => 'healthy',
            'overall_condition' => 'caries',
            'mobility_grade' => 0,
            'notes' => 'Deep occlusal-mesial carious lesion approaching pulp chamber. Cold test positive with lingering sensitivity.',
            'updated_by' => $docDentistUser->id,
        ]);

        DentalTooth::create([
            'patient_id' => $patient2->id,
            'tooth_number' => 36, // Lower Left First Molar
            'surface_occlusal' => 'filled',
            'surface_mesial' => 'healthy',
            'surface_distal' => 'healthy',
            'surface_buccal' => 'healthy',
            'surface_lingual' => 'healthy',
            'overall_condition' => 'filled',
            'mobility_grade' => 0,
            'notes' => 'Composite restoration in good condition.',
            'updated_by' => $docDentistUser->id,
        ]);

        DentalTooth::create([
            'patient_id' => $patient2->id,
            'tooth_number' => 18, // Upper Right Third Molar
            'overall_condition' => 'missing',
            'notes' => 'Congenitally absent.',
            'updated_by' => $docDentistUser->id,
        ]);

        DentalTreatment::create([
            'patient_id' => $patient2->id,
            'doctor_id' => $doctorDentist->id,
            'tooth_number' => 16,
            'procedure_name' => 'Root Canal Treatment (Endodontics, 3 canals)',
            'stage' => 'in_progress',
            'cost' => 1200.00,
            'notes' => 'Step 1: Pulpectomy & canal preparation completed. Temporary dressing placed.',
        ]);

        DentalTreatment::create([
            'patient_id' => $patient2->id,
            'doctor_id' => $doctorDentist->id,
            'tooth_number' => 16,
            'procedure_name' => 'Zirconia Aesthetic Crown Restoration',
            'stage' => 'planned',
            'cost' => 2000.00,
            'notes' => 'Scheduled following endodontic completion.',
        ]);

        // 13. Ophthalmology Exam for Patient 2 (Historical)
        OphthalmologyRecord::create([
            'consultation_id' => $consultation1->id,
            'patient_id' => $patient2->id,
            'od_va_distance' => '20/25',
            'od_va_near' => 'J1',
            'od_sph' => -1.25,
            'od_cyl' => -0.50,
            'od_axis' => 90,
            'od_add' => 0.00,
            'od_iop' => 14.5,
            'os_va_distance' => '20/30',
            'os_va_near' => 'J1',
            'os_sph' => -1.50,
            'os_cyl' => -0.75,
            'os_axis' => 85,
            'os_add' => 0.00,
            'os_iop' => 15.0,
            'pd' => 62.00,
            'glasses_prescription_notes' => 'Anti-reflective blue-block coating recommended for computer screen work.',
        ]);

        // 14. Invoicing & Billing
        $inv1 = Invoice::create([
            'branch_id' => $mainBranch->id,
            'patient_id' => $patient1->id,
            'consultation_id' => $consultation1->id,
            'invoice_number' => 'INV-2026-0001',
            'invoice_date' => $today,
            'due_date' => $today,
            'subtotal' => 300.00,
            'discount_amount' => 0.00,
            'tax_amount' => 0.00,
            'total_amount' => 300.00,
            'paid_amount' => 300.00,
            'balance_due' => 0.00,
            'status' => 'paid',
            'notes' => 'Standard specialist consultation fee.',
            'created_by' => $receptionist->id,
        ]);

        InvoiceItem::create([
            'invoice_id' => $inv1->id,
            'item_name' => 'Specialist Consultation - Internal Medicine (Dr. Youssef Alami)',
            'item_type' => 'consultation',
            'quantity' => 1,
            'unit_price' => 300.00,
            'discount' => 0.00,
            'tax_rate' => 0.00,
            'total' => 300.00,
        ]);

        Payment::create([
            'invoice_id' => $inv1->id,
            'patient_id' => $patient1->id,
            'receipt_number' => 'REC-2026-0001',
            'amount' => 300.00,
            'payment_method' => 'card',
            'transaction_reference' => 'TPE-CMI-88391',
            'payment_date' => now()->subHour(),
            'received_by' => $receptionist->id,
            'notes' => 'Electronic card transaction approved.',
        ]);

        $inv2 = Invoice::create([
            'branch_id' => $mainBranch->id,
            'patient_id' => $patient2->id,
            'invoice_number' => 'INV-2026-0002',
            'invoice_date' => $today,
            'due_date' => now()->addDays(7)->format('Y-m-d'),
            'subtotal' => 1550.00,
            'discount_amount' => 50.00,
            'tax_amount' => 0.00,
            'total_amount' => 1500.00,
            'paid_amount' => 500.00,
            'balance_due' => 1000.00,
            'status' => 'partially_paid',
            'notes' => 'Dental consultation & Endodontic pulpectomy session 1.',
            'created_by' => $receptionist->id,
        ]);

        InvoiceItem::create([
            'invoice_id' => $inv2->id,
            'item_name' => 'Dental Emergency Consultation & Examination',
            'item_type' => 'dental',
            'quantity' => 1,
            'unit_price' => 350.00,
            'discount' => 50.00,
            'tax_rate' => 0.00,
            'total' => 300.00,
        ]);

        InvoiceItem::create([
            'invoice_id' => $inv2->id,
            'item_name' => 'Root Canal Treatment (Stage 1: Pulpectomy & Canal Shaping)',
            'item_type' => 'dental',
            'quantity' => 1,
            'unit_price' => 1200.00,
            'discount' => 0.00,
            'tax_rate' => 0.00,
            'total' => 1200.00,
        ]);

        Payment::create([
            'invoice_id' => $inv2->id,
            'patient_id' => $patient2->id,
            'receipt_number' => 'REC-2026-0002',
            'amount' => 500.00,
            'payment_method' => 'cash',
            'payment_date' => now()->subMinutes(15),
            'received_by' => $receptionist->id,
            'notes' => 'Initial deposit for dental treatment plan.',
        ]);

        // 15. Inventory Products
        InventoryProduct::create([
            'branch_id' => $mainBranch->id,
            'name' => 'Amoxicillin + Clavulanic Acid (Augmentin 1g)',
            'sku' => 'MED-AUG-1G',
            'barcode' => '6111234567890',
            'category' => 'medication',
            'unit' => 'box',
            'purchase_price' => 45.00,
            'selling_price' => 78.50,
            'current_stock' => 120,
            'minimum_stock_alert' => 25,
            'is_active' => true,
        ]);

        InventoryProduct::create([
            'branch_id' => $mainBranch->id,
            'name' => 'Dental Composite Resin Syringe (A2 Shade)',
            'sku' => 'DENT-COMP-A2',
            'barcode' => '6119876543210',
            'category' => 'dental_material',
            'unit' => 'piece',
            'purchase_price' => 180.00,
            'selling_price' => 350.00,
            'current_stock' => 15,
            'minimum_stock_alert' => 5,
            'is_active' => true,
        ]);

        InventoryProduct::create([
            'branch_id' => $mainBranch->id,
            'name' => 'Sterile Nitrile Gloves (Size Medium, Box of 100)',
            'sku' => 'DISP-GLV-M',
            'category' => 'disposable',
            'unit' => 'box',
            'purchase_price' => 40.00,
            'selling_price' => 60.00,
            'current_stock' => 8, // Low stock alert!
            'minimum_stock_alert' => 10,
            'is_active' => true,
        ]);

        // 16. Specialty Form Builder Demo (Gynecology Form)
        $gynForm = SpecialtyForm::create([
            'name' => 'Gynecological & Obstetric Examination Sheet',
            'specialty_code' => 'gynecology',
            'version' => 1,
            'is_active' => true,
            'description' => 'Comprehensive obstetric history, gestational age and ultrasound metrics.',
        ]);

        SpecialtyFormField::create([
            'form_id' => $gynForm->id,
            'label' => 'Last Menstrual Period (LMP)',
            'field_key' => 'lmp_date',
            'field_type' => 'date',
            'is_required' => true,
            'order_index' => 1,
        ]);

        SpecialtyFormField::create([
            'form_id' => $gynForm->id,
            'label' => 'Gravidity / Parity (G/P)',
            'field_key' => 'gravidity_parity',
            'field_type' => 'text',
            'is_required' => false,
            'order_index' => 2,
        ]);

        SpecialtyFormField::create([
            'form_id' => $gynForm->id,
            'label' => 'Contraception Method',
            'field_key' => 'contraception',
            'field_type' => 'select',
            'is_required' => false,
            'options' => ['None', 'Oral Contraceptive Pill', 'IUD / Mirena', 'Implant', 'Barrier'],
            'order_index' => 3,
        ]);

        // Mark installed flag
        file_put_contents(storage_path('installed'), json_encode([
            'installed_at' => now()->toIso8601String(),
            'version' => '1.0.0',
            'environment' => config('app.env'),
        ]));
    }
}
