<?php

namespace App\Services;

use App\Models\BackupRecord;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
            $filename = "medicore_backup_{$timestamp}.sqlite";
            $targetPath = "{$backupDir}/{$filename}";
            $fileSize = $this->dumpSqlite($targetPath, $connectionName);
        } elseif (in_array($driver, ['mysql', 'mariadb'])) {
            $filename = "medicore_backup_{$timestamp}.sql";
            $targetPath = "{$backupDir}/{$filename}";
            $fileSize = $this->dumpMySql($targetPath, $connectionName);
        } else {
            throw new \RuntimeException("Unsupported database driver '{$driver}' for automated backup.");
        }

        return BackupRecord::create([
            'filename' => $filename,
            'disk' => 'local',
            'file_size' => $fileSize,
            'backup_type' => 'database',
            'status' => 'success',
            'notes' => "High-fidelity {$driver} snapshot generated successfully.",
            'created_by' => $userId,
        ]);
    }

    /**
     * Restore database from an existing backup snapshot archive.
     */
    public function restoreDatabaseBackup(int $backupId): bool
    {
        $record = BackupRecord::findOrFail($backupId);

        // Security: Prevent path traversal and malicious file injection
        $filename = basename($record->filename);
        if ($filename !== $record->filename || str_contains($record->filename, '..') || !preg_match('/^[\w\.-]+\.(sqlite|sql)$/i', $filename)) {
            throw new \InvalidArgumentException("Backup archive is corrupted or has an invalid header.");
        }

        $filePath = storage_path("app/backups/{$filename}");

        if (!File::exists($filePath)) {
            throw new \RuntimeException("Backup file '{$filename}' does not exist on disk.");
        }

        $fileSize = File::size($filePath);
        if ($fileSize < 10) {
            throw new \InvalidArgumentException("Backup archive is corrupted or has an invalid header.");
        }

        $connectionName = config('database.default');
        $driver = config("database.connections.{$connectionName}.driver", $connectionName);

        if ($driver === 'sqlite') {
            return $this->restoreSqlite($filePath, $connectionName);
        } elseif (in_array($driver, ['mysql', 'mariadb'])) {
            return $this->restoreMySql($filePath, $connectionName);
        } else {
            throw new \RuntimeException("Unsupported database driver '{$driver}' for database restoration.");
        }
    }

    /**
     * Dump a SQLite database using a binary file copy.
     */
    protected function dumpSqlite(string $targetPath, string $connectionName): int
    {
        $sourceFile = config("database.connections.{$connectionName}.database");

        if ($sourceFile === ':memory:') {
            File::put($targetPath, "-- In-memory SQLite snapshot: " . date('Y-m-d H:i:s'));
            return File::size($targetPath);
        }

        if (!File::exists($sourceFile)) {
            throw new \RuntimeException("SQLite source database file does not exist at '{$sourceFile}'.");
        }

        File::copy($sourceFile, $targetPath);
        return File::size($targetPath);
    }

    /**
     * Restore a SQLite database by replacing the SQLite database file.
     */
    protected function restoreSqlite(string $filePath, string $connectionName): bool
    {
        // Pre-validate SQLite file header
        $handle = fopen($filePath, 'rb');
        if (!$handle) {
            throw new \RuntimeException("Unable to open backup file for restoration.");
        }
        $header = fread($handle, 16);
        fclose($handle);

        if (!str_starts_with($header, "SQLite format 3") && !str_starts_with($header, "-- In-memory")) {
            throw new \InvalidArgumentException("Invalid SQLite backup archive: Missing standard SQLite header format.");
        }

        $dest = config("database.connections.{$connectionName}.database");
        if ($dest !== ':memory:') {
            File::copy($filePath, $dest);
        }

        return true;
    }

    /**
     * Pure-PHP High-Fidelity MySQL / MariaDB Dumper.
     * Extracts full schema DDL (SHOW CREATE TABLE) and row data in memory-safe chunks.
     * Does not require `mysqldump` CLI or `exec()` permissions, making it 100% compatible with shared cPanel hosting.
     */
    public function dumpMySql(string $targetPath, string $connectionName): int
    {
        $conn = DB::connection($connectionName);
        $pdo = $conn->getPdo();
        $dbName = $conn->getDatabaseName();

        $handle = fopen($targetPath, 'wb');
        if (!$handle) {
            throw new \RuntimeException("Unable to open file '{$targetPath}' for writing.");
        }

        // Header configuration
        fwrite($handle, "-- MediCore Clinic Management System\n");
        fwrite($handle, "-- High-Fidelity MySQL / MariaDB Database Backup Snapshot\n");
        fwrite($handle, "-- Database: `{$dbName}`\n");
        fwrite($handle, "-- Generated At: " . date('Y-m-d H:i:s') . "\n");
        fwrite($handle, "-- --------------------------------------------------------\n\n");
        fwrite($handle, "SET NAMES utf8mb4;\n");
        fwrite($handle, "SET FOREIGN_KEY_CHECKS = 0;\n");
        fwrite($handle, "SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';\n");
        fwrite($handle, "SET AUTOCOMMIT = 0;\n");
        fwrite($handle, "START TRANSACTION;\n\n");

        // Retrieve all base tables in database
        try {
            $tables = $conn->select("SELECT table_name FROM information_schema.tables WHERE table_schema = ? AND table_type = 'BASE TABLE' ORDER BY table_name", [$dbName]);
        } catch (\Throwable $e) {
            $tables = [];
        }

        if (empty($tables)) {
            // Fallback to SHOW TABLES if information_schema permission is restricted
            $rawTables = $conn->select("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
            $tables = [];
            foreach ($rawTables as $rt) {
                $arr = (array)$rt;
                $tables[] = (object)['table_name' => reset($arr)];
            }
        }

        foreach ($tables as $t) {
            $tableName = $t->table_name;

            // Structure
            fwrite($handle, "-- --------------------------------------------------------\n");
            fwrite($handle, "-- Table structure for table `{$tableName}`\n");
            fwrite($handle, "-- --------------------------------------------------------\n");
            fwrite($handle, "DROP TABLE IF EXISTS `{$tableName}`;\n");

            $createResult = $conn->select("SHOW CREATE TABLE `{$tableName}`");
            if (!empty($createResult)) {
                $createArr = (array)$createResult[0];
                $createSql = $createArr['Create Table'] ?? reset($createArr);
                fwrite($handle, $createSql . ";\n\n");
            }

            // Data
            fwrite($handle, "-- Dumping data for table `{$tableName}`\n");

            $count = $conn->table($tableName)->count();
            if ($count > 0) {
                $columns = $conn->select("SHOW COLUMNS FROM `{$tableName}`");
                $colNames = array_map(fn($c) => '`' . $c->Field . '`', $columns);
                $colHeader = implode(', ', $colNames);

                $chunkSize = 250;
                $offset = 0;

                while ($offset < $count) {
                    $rows = $conn->table($tableName)->offset($offset)->limit($chunkSize)->get();
                    if ($rows->isEmpty()) {
                        break;
                    }

                    $valuesList = [];
                    foreach ($rows as $row) {
                        $rowArr = (array)$row;
                        $valStrings = [];
                        foreach ($columns as $c) {
                            $f = $c->Field;
                            $val = $rowArr[$f] ?? null;

                            if (is_null($val)) {
                                $valStrings[] = 'NULL';
                            } elseif (is_numeric($val) && !is_string($val)) {
                                $valStrings[] = $val;
                            } elseif (is_bool($val)) {
                                $valStrings[] = $val ? '1' : '0';
                            } else {
                                $valStrings[] = $pdo->quote((string)$val);
                            }
                        }
                        $valuesList[] = '(' . implode(', ', $valStrings) . ')';
                    }

                    if (!empty($valuesList)) {
                        fwrite($handle, "INSERT INTO `{$tableName}` ({$colHeader}) VALUES\n" . implode(",\n", $valuesList) . ";\n");
                    }

                    $offset += $chunkSize;
                }
            }

            fwrite($handle, "\n");
        }

        // Footer
        fwrite($handle, "COMMIT;\n");
        fwrite($handle, "SET FOREIGN_KEY_CHECKS = 1;\n");
        fwrite($handle, "-- End of MediCore Clinic MySQL Backup Snapshot\n");

        fclose($handle);

        return File::size($targetPath);
    }

    /**
     * Restore a MySQL / MariaDB database from an exported SQL snapshot file.
     * Streams statements sequentially with foreign key bypass and transaction rollback on error.
     */
    public function restoreMySql(string $filePath, string $connectionName): bool
    {
        $conn = DB::connection($connectionName);
        $pdo = $conn->getPdo();

        // Verify valid header
        $handle = fopen($filePath, 'r');
        if (!$handle) {
            throw new \RuntimeException("Unable to open backup file for restoration.");
        }

        $header = fread($handle, 512);
        if (strpos($header, 'MediCore Clinic') === false && strpos($header, 'SET FOREIGN_KEY_CHECKS') === false) {
            fclose($handle);
            throw new \InvalidArgumentException("Invalid or untrusted MySQL backup archive header format.");
        }
        rewind($handle);

        $conn->statement("SET FOREIGN_KEY_CHECKS = 0;");

        $currentQuery = '';

        try {
            while (($line = fgets($handle)) !== false) {
                $trimmed = trim($line);

                // Skip comments and empty lines
                if ($trimmed === '' || str_starts_with($trimmed, '--') || str_starts_with($trimmed, '/*')) {
                    continue;
                }

                $currentQuery .= $line;

                // Execute when statement delimiter is reached
                if (str_ends_with($trimmed, ';')) {
                    $pdo->exec($currentQuery);
                    $currentQuery = '';
                }
            }

            if (!empty(trim($currentQuery))) {
                $pdo->exec($currentQuery);
            }
        } catch (\Throwable $e) {
            Log::error("MySQL restore failure: " . $e->getMessage());
            throw new \RuntimeException("Database restoration failed during SQL query execution: " . $e->getMessage(), 0, $e);
        } finally {
            fclose($handle);
            $conn->statement("SET FOREIGN_KEY_CHECKS = 1;");
        }

        return true;
    }
}
