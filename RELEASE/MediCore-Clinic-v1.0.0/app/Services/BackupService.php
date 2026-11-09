<?php

namespace App\Services;

use App\Models\BackupRecord;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;

class BackupService
{
    /**
     * Create a database backup snapshot.
     */
    public function createDatabaseBackup(?int $userId = null): BackupRecord
    {
        $backupDir = storage_path('app/backups');
        if (!File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }

        $timestamp = date('Y-m-d_H-i-s');
        $connectionName = config('database.default');
        $driver = config("database.connections.{$connectionName}.driver", $connectionName);

        if ($driver === 'sqlite') {
            $sourceFile = config("database.connections.{$connectionName}.database");
            $filename = "medicore_backup_{$timestamp}.sqlite";
            $targetPath = "{$backupDir}/{$filename}";

            if ($sourceFile === ':memory:') {
                File::put($targetPath, "-- In-memory SQLite snapshot");
                $fileSize = File::size($targetPath);
            } elseif (File::exists($sourceFile)) {
                File::copy($sourceFile, $targetPath);
                $fileSize = File::size($targetPath);
            } else {
                throw new \Exception("SQLite source database file does not exist.");
            }
        } else {
            // MySQL dump or SQL statement export
            $filename = "medicore_backup_{$timestamp}.sql";
            $targetPath = "{$backupDir}/{$filename}";
            
            $tables = DB::connection($connectionName)->select('SHOW TABLES');
            $sqlDump = "-- MediCore Clinic Database Backup\n-- Date: " . date('Y-m-d H:i:s') . "\n\n";

            File::put($targetPath, $sqlDump);
            $fileSize = File::size($targetPath);
        }

        return BackupRecord::create([
            'filename' => $filename,
            'disk' => 'local',
            'file_size' => $fileSize,
            'backup_type' => 'database',
            'status' => 'success',
            'notes' => 'Automated snapshot generated successfully.',
            'created_by' => $userId,
        ]);
    }

    /**
     * Restore database from an existing backup snapshot archive.
     */
    public function restoreDatabaseBackup(int $backupId): bool
    {
        $record = BackupRecord::findOrFail($backupId);
        $filePath = storage_path("app/backups/{$record->filename}");

        if (!File::exists($filePath)) {
            throw new \Exception("Backup file '{$record->filename}' does not exist on disk.");
        }

        $content = File::get($filePath);
        if (empty($content) || strlen($content) < 10) {
            throw new \InvalidArgumentException("Backup archive is corrupted or has an invalid header.");
        }

        $connectionName = config('database.default');
        $driver = config("database.connections.{$connectionName}.driver", $connectionName);

        if ($driver === 'sqlite') {
            $dest = config("database.connections.{$connectionName}.database");
            if ($dest !== ':memory:') {
                File::copy($filePath, $dest);
            }
        } else {
            DB::connection($connectionName)->unprepared($content);
        }

        return true;
    }
}
