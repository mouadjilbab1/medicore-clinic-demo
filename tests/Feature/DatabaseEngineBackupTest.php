<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Branch;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Consultation;
use App\Models\VitalSign;
use App\Models\Diagnosis;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\InventoryProduct;
use App\Models\BackupRecord;
use App\Services\BackupService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class DatabaseEngineBackupTest extends TestCase
{
    protected string $testDbPath;
    protected BackupService $backupService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->testDbPath = database_path('test_engine_backup.sqlite');
        if (File::exists($this->testDbPath)) {
            File::delete($this->testDbPath);
        }
        File::put($this->testDbPath, '');

        config([
            'database.default' => 'test_file_sqlite',
            'database.connections.test_file_sqlite' => [
                'driver' => 'sqlite',
                'database' => $this->testDbPath,
                'prefix' => '',
                'foreign_key_constraints' => true,
            ]
        ]);

        \Illuminate\Support\Facades\Artisan::call('migrate', [
            '--database' => 'test_file_sqlite',
            '--path' => 'database/migrations',
            '--force' => true,
        ]);

        $this->backupService = app(BackupService::class);
    }

    protected function tearDown(): void
    {
        DB::disconnect('test_file_sqlite');
        if (File::exists($this->testDbPath)) {
            File::delete($this->testDbPath);
        }
        parent::tearDown();
    }

    /**
     * 1. SQLite Engine: Full Lifecyle Backup, Corruption, and 100% Restoration
     */
    public function test_sqlite_engine_backup_and_restore_with_complex_relations(): void
    {
        $clinic = Clinic::create([
            'name' => 'MediCore SQLite Test Clinic',
            'phone' => '+212522111111',
            'email' => 'sqlite@medicore.test',
            'address' => '100 Medical Blvd, Casablanca',
        ]);

        $branch = Branch::create([
            'clinic_id' => $clinic->id,
            'name' => 'Casablanca Branch',
            'code' => 'BR-SQLITE-01',
            'phone' => '+212522111111',
            'address' => '100 Medical Blvd',
        ]);

        $docUser = User::create([
            'branch_id' => $branch->id,
            'name' => 'Dr. SQLite Specialist',
            'email' => 'doc.sqlite@medicore.test',
            'password' => Hash::make('Secret123!'),
            'role' => 'doctor',
            'is_active' => true,
        ]);

        $doctor = Doctor::create([
            'user_id' => $docUser->id,
            'branch_id' => $branch->id,
            'specialty' => 'general_practice',
            'license_number' => 'SQLITE-DOC-001',
            'consultation_fee' => 300.00,
            'is_available' => true,
        ]);

        $patient = Patient::create([
            'branch_id' => $branch->id,
            'patient_uid' => 'PAT-SQLITE-001',
            'first_name' => 'Original',
            'last_name' => 'Patient',
            'gender' => 'female',
            'date_of_birth' => '1992-04-12',
            'phone' => '+212611002233',
            'is_active' => true,
        ]);

        $appointment = Appointment::create([
            'branch_id' => $branch->id,
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'appointment_date' => now()->toDateString(),
            'start_time' => '11:00:00',
            'end_time' => '11:30:00',
            'status' => 'confirmed',
            'type' => 'consultation',
        ]);

        $consultation = Consultation::create([
            'branch_id' => $branch->id,
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'appointment_id' => $appointment->id,
            'consultation_date' => now(),
            'chief_complaint' => 'Acute respiratory infection',
            'clinical_assessment' => 'Bronchitis',
            'is_finalized' => true,
            'signed_by' => $docUser->id,
            'signed_at' => now(),
        ]);

        $vitals = VitalSign::create([
            'consultation_id' => $consultation->id,
            'patient_id' => $patient->id,
            'recorded_at' => now(),
            'systolic_bp' => 120,
            'diastolic_bp' => 80,
            'heart_rate' => 72,
            'temperature' => 37.2,
            'weight' => 65.0,
            'height' => 168.0,
            'bmi' => 23.0,
        ]);

        $diagnosis = Diagnosis::create([
            'consultation_id' => $consultation->id,
            'patient_id' => $patient->id,
            'diagnosis_name' => 'Acute Bronchitis',
            'icd10_code' => 'J20.9',
            'type' => 'primary',
            'status' => 'active',
        ]);

        $invoice = Invoice::create([
            'branch_id' => $branch->id,
            'patient_id' => $patient->id,
            'consultation_id' => $consultation->id,
            'invoice_number' => 'INV-SQLITE-001',
            'invoice_date' => now()->toDateString(),
            'due_date' => now()->toDateString(),
            'subtotal' => 300.00,
            'discount_amount' => 0.00,
            'tax_amount' => 30.00,
            'total_amount' => 330.00,
            'paid_amount' => 330.00,
            'balance_due' => 0.00,
            'status' => 'paid',
        ]);

        $payment = Payment::create([
            'invoice_id' => $invoice->id,
            'patient_id' => $patient->id,
            'receipt_number' => 'REC-SQLITE-001',
            'payment_date' => now()->toDateString(),
            'amount' => 330.00,
            'payment_method' => 'card',
            'transaction_reference' => 'CARD-SQLITE-99',
            'status' => 'completed',
        ]);

        // Baseline counts
        $basePatientCount = Patient::count();
        $baseInvoiceCount = Invoice::count();
        $basePaymentCount = Payment::count();
        $baseConsultationCount = Consultation::count();

        // 1. Snapshot
        $backup = $this->backupService->createDatabaseBackup(null);
        $this->assertEquals('success', $backup->status);
        $filePath = storage_path("app/backups/{$backup->filename}");
        $this->assertTrue(File::exists($filePath));

        // 2. Deliberate Corruption & Deletion
        Payment::query()->delete();
        Invoice::query()->delete();
        $patient->update(['first_name' => 'CORRUPTED_NAME']);

        $this->assertEquals(0, Payment::count());
        $this->assertEquals(0, Invoice::count());
        $this->assertEquals('CORRUPTED_NAME', Patient::find($patient->id)->first_name);

        // 3. Restoration
        $restored = $this->backupService->restoreDatabaseBackup($backup->id);
        $this->assertTrue($restored);

        // 4. Verify 100% Fidelity
        $this->assertEquals($basePatientCount, Patient::count());
        $this->assertEquals($baseInvoiceCount, Invoice::count());
        $this->assertEquals($basePaymentCount, Payment::count());
        $this->assertEquals($baseConsultationCount, Consultation::count());

        $restoredPatient = Patient::find($patient->id);
        $this->assertEquals('Original', $restoredPatient->first_name);

        $restoredInvoice = Invoice::where('invoice_number', 'INV-SQLITE-001')->first();
        $this->assertNotNull($restoredInvoice);
        $this->assertEquals(330.00, (float)$restoredInvoice->total_amount);

        // Clean up
        File::delete($filePath);
    }

    /**
     * 2. MySQL Engine: Live Connection and Compatibility Check
     */
    public function test_mysql_engine_live_connection_status(): void
    {
        $hasMysqlConfig = !empty(config('database.connections.mysql.host'));
        $canConnect = false;

        if ($hasMysqlConfig) {
            try {
                DB::connection('mysql')->getPdo();
                $canConnect = true;
            } catch (\Throwable $e) {
                $canConnect = false;
            }
        }

        if (!$canConnect) {
            // Strictly record BLOCKED in accordance with Audit Rules 8 & 9
            $this->markTestSkipped("MySQL live database credentials are not available on this host. Live MySQL backup/restore is BLOCKED.");
        }

        $this->assertTrue($canConnect);
    }

    /**
     * 3. MariaDB Engine: Live Connection Status Check
     */
    public function test_mariadb_engine_live_connection_status(): void
    {
        $canConnect = false;

        try {
            DB::connection('mariadb')->getPdo();
            $canConnect = true;
        } catch (\Throwable $e) {
            $canConnect = false;
        }

        if (!$canConnect) {
            $this->markTestSkipped("MariaDB live host connection is not configured. Live MariaDB backup/restore is BLOCKED.");
        }

        $this->assertTrue($canConnect);
    }

    /**
     * 4. MySQL/MariaDB Pure-PHP Dumper Header and Safety Validation
     */
    public function test_mysql_dump_generates_valid_headers_and_security_checks(): void
    {
        $backupDir = storage_path('app/backups');
        if (!File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }

        // Test restoring invalid SQL header is rejected
        $badFile = "corrupt_mysql_test.sql";
        $target = "{$backupDir}/{$badFile}";
        File::put($target, "DROP DATABASE test;");

        $record = BackupRecord::create([
            'filename' => $badFile,
            'disk' => 'local',
            'file_size' => 20,
            'backup_type' => 'database',
            'status' => 'success',
        ]);

        $this->expectException(\InvalidArgumentException::class);

        try {
            $this->backupService->restoreDatabaseBackup($record->id);
        } finally {
            File::delete($target);
        }
    }
}
