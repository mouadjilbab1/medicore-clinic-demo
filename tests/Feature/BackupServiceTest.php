<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Branch;
use App\Models\BackupRecord;
use App\Services\BackupService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class BackupServiceTest extends TestCase
{
    use RefreshDatabase;

    protected BackupService $backupService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->backupService = app(BackupService::class);
    }

    public function test_backup_service_generates_snapshot_and_stores_record(): void
    {
        $record = $this->backupService->createDatabaseBackup(null);

        $this->assertInstanceOf(BackupRecord::class, $record);
        $this->assertEquals('success', $record->status);
        $this->assertGreaterThan(0, $record->file_size);

        $filePath = storage_path("app/backups/{$record->filename}");
        $this->assertTrue(File::exists($filePath));

        // Clean up
        File::delete($filePath);
    }

    public function test_backup_restore_executes_successfully(): void
    {
        $record = $this->backupService->createDatabaseBackup(null);
        $filePath = storage_path("app/backups/{$record->filename}");

        $restored = $this->backupService->restoreDatabaseBackup($record->id);
        $this->assertTrue($restored);

        File::delete($filePath);
    }

    public function test_corrupted_backup_handling_throws_exception(): void
    {
        $backupDir = storage_path('app/backups');
        if (!File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }

        $corruptFile = "corrupt_test_backup.sqlite";
        File::put("{$backupDir}/{$corruptFile}", "BAD"); // Too short / invalid header

        $record = BackupRecord::create([
            'filename' => $corruptFile,
            'disk' => 'local',
            'file_size' => 3,
            'backup_type' => 'database',
            'status' => 'success',
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Backup archive is corrupted or has an invalid header.');

        try {
            $this->backupService->restoreDatabaseBackup($record->id);
        } finally {
            File::delete("{$backupDir}/{$corruptFile}");
        }
    }

    public function test_unauthenticated_user_cannot_trigger_backup_or_restore(): void
    {
        $responseCreate = $this->post(route('backups.create'));
        $responseCreate->assertRedirect('/login');

        $responseRestore = $this->post(route('backups.restore', 1));
        $responseRestore->assertRedirect('/login');
    }
}
