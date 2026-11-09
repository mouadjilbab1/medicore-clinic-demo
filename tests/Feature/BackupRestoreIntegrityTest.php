<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\BackupRecord;
use App\Services\BackupService;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

class BackupRestoreIntegrityTest extends TestCase
{
    protected string $testDbPath;
    protected BackupService $backupService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->testDbPath = database_path('test_integrity.sqlite');
        if (File::exists($this->testDbPath)) {
            File::delete($this->testDbPath);
        }
        File::put($this->testDbPath, '');

        // Configure a dedicated connection pointing to real file-based SQLite
        config(['database.connections.test_file_sqlite' => [
            'driver' => 'sqlite',
            'database' => $this->testDbPath,
            'prefix' => '',
            'foreign_key_constraints' => true,
        ]]);

        $this->backupService = app(BackupService::class);
    }

    protected function tearDown(): void
    {
        if (File::exists($this->testDbPath)) {
            File::delete($this->testDbPath);
        }
        parent::tearDown();
    }

    public function test_complete_backup_creation_intentional_corruption_and_100_percent_restoration(): void
    {
        // 1. Run migrations on the real file SQLite database
        Artisan::call('migrate', [
            '--database' => 'test_file_sqlite',
            '--path' => 'database/migrations',
            '--force' => true,
        ]);

        $connection = DB::connection('test_file_sqlite');

        // 2. Populate comprehensive dataset across clinical and financial domains
        $connection->table('clinics')->insert([
            'name' => 'Integrity Validation Clinic',
            'phone' => '+1555999888',
            'email' => 'clinic@integrity.test',
            'address' => '500 Test Avenue',
            'country' => 'Morocco',
            'currency' => 'MAD',
            'timezone' => 'UTC',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $connection->table('branches')->insert([
            'clinic_id' => 1,
            'name' => 'Integrity Branch',
            'code' => 'INT01',
            'is_main' => 1,
            'is_active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        for ($i = 1; $i <= 50; $i++) {
            $connection->table('patients')->insert([
                'branch_id' => 1,
                'patient_uid' => sprintf('PAT-2026-%04d', $i),
                'first_name' => "Patient{$i}",
                'last_name' => "Record{$i}",
                'gender' => ($i % 2 === 0) ? 'female' : 'male',
                'date_of_birth' => '1990-01-01',
                'phone' => "+1555000{$i}",
                'email' => "patient{$i}@integrity.test",
                'national_id' => "CIN-INT-{$i}",
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        for ($i = 1; $i <= 30; $i++) {
            $connection->table('invoices')->insert([
                'branch_id' => 1,
                'patient_id' => $i,
                'invoice_number' => sprintf('INV-2026-%04d', $i),
                'invoice_date' => now()->toDateString(),
                'due_date' => now()->toDateString(),
                'subtotal' => 500.00,
                'discount_amount' => 50.00,
                'tax_amount' => 45.00,
                'total_amount' => 495.00,
                'paid_amount' => 495.00,
                'balance_due' => 0.00,
                'status' => 'paid',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Verify baseline counts
        $this->assertEquals(50, $connection->table('patients')->count());
        $this->assertEquals(30, $connection->table('invoices')->count());

        // 3. Create full database backup snapshot
        config(['database.default' => 'test_file_sqlite']);
        $backupRecord = $this->backupService->createDatabaseBackup(null);

        $this->assertInstanceOf(BackupRecord::class, $backupRecord);
        $this->assertEquals('success', $backupRecord->status);
        $this->assertGreaterThan(1000, $backupRecord->file_size);

        $backupFilePath = storage_path("app/backups/{$backupRecord->filename}");
        $this->assertTrue(File::exists($backupFilePath));

        // 4. Intentionally corrupt / wipe the database (Simulating data loss disaster)
        $connection->table('invoices')->delete();
        $connection->table('patients')->where('id', '>', 10)->delete();
        $connection->table('patients')->where('id', 1)->update(['first_name' => 'CORRUPTED_NAME']);

        // Verify data loss occurred
        $this->assertEquals(0, $connection->table('invoices')->count());
        $this->assertEquals(10, $connection->table('patients')->count());
        $this->assertEquals('CORRUPTED_NAME', $connection->table('patients')->where('id', 1)->value('first_name'));

        // 5. Trigger Restoration from Backup
        $restored = $this->backupService->restoreDatabaseBackup($backupRecord->id);
        $this->assertTrue($restored);

        // 6. Verify 100% Data Fidelity after Restoration
        // Re-open fresh connection to ensure disk cache is not serving old memory state
        DB::purge('test_file_sqlite');
        $freshConnection = DB::connection('test_file_sqlite');

        $this->assertEquals(50, $freshConnection->table('patients')->count(), 'Patient count must match exactly 50 after restore.');
        $this->assertEquals(30, $freshConnection->table('invoices')->count(), 'Invoice count must match exactly 30 after restore.');

        $patient1 = $freshConnection->table('patients')->where('id', 1)->first();
        $this->assertEquals('Patient1', $patient1->first_name, 'Patient #1 first name must be restored to original.');
        $this->assertEquals('PAT-2026-0001', $patient1->patient_uid);

        $patient50 = $freshConnection->table('patients')->where('id', 50)->first();
        $this->assertNotNull($patient50, 'Patient #50 must exist.');
        $this->assertEquals('PAT-2026-0050', $patient50->patient_uid);

        $invoice30 = $freshConnection->table('invoices')->where('id', 30)->first();
        $this->assertNotNull($invoice30, 'Invoice #30 must exist.');
        $this->assertEquals(495.00, floatval($invoice30->total_amount));
        $this->assertEquals('paid', $invoice30->status);

        // Clean up backup file
        if (File::exists($backupFilePath)) {
            File::delete($backupFilePath);
        }
    }
}
