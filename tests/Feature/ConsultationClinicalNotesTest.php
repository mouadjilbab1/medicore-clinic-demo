<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Branch;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Consultation;
use App\Models\VitalSign;
use App\Models\Diagnosis;
use App\Models\ClinicalNoteRevision;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class ConsultationClinicalNotesTest extends TestCase
{
    use RefreshDatabase;

    protected User $doctorUser;
    protected Doctor $doctor;
    protected Patient $patient;

    protected function setUp(): void
    {
        parent::setUp();

        $clinic = Clinic::create([
            'name' => 'MediCore Clinic',
            'phone' => '+1 555-0100',
            'email' => 'contact@medicore.test',
            'address' => '123 Medical Center Way',
            'country' => 'Morocco',
            'currency' => 'USD',
            'timezone' => 'UTC',
        ]);

        $branch = Branch::create([
            'clinic_id' => $clinic->id,
            'name' => 'Main Branch',
            'code' => 'MAIN',
            'phone' => '+1 555-0100',
            'address' => '123 Medical Center Way',
            'is_main' => true,
            'is_active' => true,
        ]);

        $this->doctorUser = User::create([
            'branch_id' => $branch->id,
            'name' => 'Dr. Gregory House',
            'email' => 'house@medicore.test',
            'phone' => '+1 555-0300',
            'password' => Hash::make('password123'),
            'role' => 'doctor',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->doctor = Doctor::create([
            'user_id' => $this->doctorUser->id,
            'specialty' => 'internal_medicine',
            'license_number' => 'MD-1002',
            'consultation_fee' => 200.00,
            'followup_fee' => 100.00,
            'slot_duration_minutes' => 30,
            'is_available' => true,
        ]);

        $this->patient = Patient::create([
            'branch_id' => $branch->id,
            'patient_uid' => 'PAT-2026-0001',
            'first_name' => 'James',
            'last_name' => 'Wilson',
            'date_of_birth' => '1980-08-20',
            'gender' => 'male',
            'phone' => '+1-555-8888',
            'is_active' => true,
        ]);
    }

    public function test_vital_signs_recording_calculates_bmi(): void
    {
        $this->actingAs($this->doctorUser);

        $consultation = Consultation::create([
            'branch_id' => 1,
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctor->id,
            'consultation_date' => now(),
            'chief_complaint' => 'Annual executive health checkup',
            'is_finalized' => false,
        ]);

        $response = $this->post(route('consultations.vitals', $consultation->id), [
            'systolic_bp' => 120,
            'diastolic_bp' => 80,
            'heart_rate' => 72,
            'temperature' => 36.6,
            'weight' => 70,    // 70 kg
            'height' => 175,   // 1.75 m -> BMI = 70 / (1.75^2) = 22.9
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('vital_signs', [
            'consultation_id' => $consultation->id,
            'systolic_bp' => 120,
            'diastolic_bp' => 80,
            'bmi' => 22.9,
        ]);
    }

    public function test_clinical_note_signing_locks_the_record(): void
    {
        $this->actingAs($this->doctorUser);

        $consultation = Consultation::create([
            'branch_id' => 1,
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctor->id,
            'consultation_date' => now(),
            'chief_complaint' => 'Acute migraine',
            'clinical_assessment' => 'Tension headache vs classical migraine',
            'treatment_plan' => 'Prescribed sumatriptan and hydration',
            'is_finalized' => false,
        ]);

        $response = $this->post(route('consultations.sign', $consultation->id));
        $response->assertRedirect();

        $consultation->refresh();
        $this->assertTrue($consultation->is_finalized);
        $this->assertNotNull($consultation->signed_at);
        $this->assertEquals($this->doctorUser->id, $consultation->signed_by);
    }

    public function test_post_finalization_revisions_create_audit_trail_and_archive_previous_content(): void
    {
        $this->actingAs($this->doctorUser);

        $consultation = Consultation::create([
            'branch_id' => 1,
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctor->id,
            'consultation_date' => now(),
            'chief_complaint' => 'Mild sore throat',
            'treatment_plan' => 'Rest and lozenges',
            'is_finalized' => true,
            'signed_at' => now(),
            'signed_by' => $this->doctorUser->id,
        ]);

        // Add addendum
        $response = $this->post(route('consultations.revisions', $consultation->id), [
            'revision_reason' => 'Patient called back reporting fever spike to 39C; throat culture confirmed streptococcus',
            'treatment_plan' => 'Rest, lozenges, and Amoxicillin 500mg TID for 10 days',
        ]);

        $response->assertRedirect();

        // Verify revision table has old content snapshot
        $this->assertDatabaseHas('clinical_note_revisions', [
            'consultation_id' => $consultation->id,
            'revised_by' => $this->doctorUser->id,
        ]);

        $revision = ClinicalNoteRevision::where('consultation_id', $consultation->id)->first();
        $this->assertStringContainsString('streptococcus', $revision->revision_reason);
        $this->assertEquals('Rest and lozenges', $revision->previous_content['treatment_plan']);

        // Verify consultation is updated with the amended treatment plan
        $consultation->refresh();
        $this->assertEquals('Rest, lozenges, and Amoxicillin 500mg TID for 10 days', $consultation->treatment_plan);
    }

    public function test_dermatology_lesion_record_creation(): void
    {
        $this->actingAs($this->doctorUser);

        $consultation = Consultation::create([
            'branch_id' => 1,
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctor->id,
            'consultation_date' => now(),
            'chief_complaint' => 'Skin rash on upper back',
            'is_finalized' => false,
        ]);

        $response = $this->post(route('consultations.dermatology', $consultation->id), [
            'body_location_key' => 'back',
            'condition_type' => 'Psoriasis plaque',
            'lesion_description' => 'Erythematous scaly plaque with silver scales, 3cm diameter',
            'session_number' => 1,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('dermatology_records', [
            'consultation_id' => $consultation->id,
            'patient_id' => $this->patient->id,
            'body_location_key' => 'back',
            'condition_type' => 'Psoriasis plaque',
        ]);
    }

    public function test_pediatric_growth_record_creation_with_percentiles(): void
    {
        $this->actingAs($this->doctorUser);

        $consultation = Consultation::create([
            'branch_id' => 1,
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctor->id,
            'consultation_date' => now(),
            'chief_complaint' => '12-month well-child examination',
            'is_finalized' => false,
        ]);

        $response = $this->post(route('consultations.pediatrics', $consultation->id), [
            'age_months' => 12,
            'height_cm' => 76.0,
            'weight_kg' => 10.2,
            'head_circumference_cm' => 46.5,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('pediatric_growth_records', [
            'consultation_id' => $consultation->id,
            'patient_id' => $this->patient->id,
            'age_months' => 12,
        ]);
    }

    public function test_physiotherapy_session_record_creation(): void
    {
        $this->actingAs($this->doctorUser);

        $consultation = Consultation::create([
            'branch_id' => 1,
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctor->id,
            'consultation_date' => now(),
            'chief_complaint' => 'Post-op ACL reconstruction rehabilitation',
            'is_finalized' => false,
        ]);

        $response = $this->post(route('consultations.physiotherapy', $consultation->id), [
            'pain_vas_score' => 4,
            'joint_assessed' => 'Left Knee',
            'rom_measurement' => 'Flexion 95 deg, Extension 0 deg',
            'mobility_score' => 'Partial weight-bearing with crutches',
            'exercises_prescribed' => 'Quad sets, straight leg raises, patellar mobilizations',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('physiotherapy_sessions', [
            'consultation_id' => $consultation->id,
            'patient_id' => $this->patient->id,
            'joint_assessed' => 'Left Knee',
            'pain_vas_score' => 4,
        ]);
    }
}
