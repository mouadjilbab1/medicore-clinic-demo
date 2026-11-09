<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\BackupRecord;
use App\Services\BackupService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;

class BackupServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_backup_service_generates_snapshot_and_stores_record(): void
    {
        $backupService = app(BackupService::class);
        $record = $backupService->createDatabaseBackup(null);

        $this->assertInstanceOf(BackupRecord::class, $record);
        $this->assertEquals('success', $record->status);
        $this->assertGreaterThan(0, $record->file_size);

        $filePath = storage_path("app/backups/{$record->filename}");
        $this->assertTrue(File::exists($filePath));

        // Clean up
        File::delete($filePath);
    }
}
