<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\BackupRecord;
use App\Services\BackupService;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BackupController extends Controller
{
    public function __construct(protected BackupService $backupService)
    {
    }

    public function index(): Response
    {
        $backups = BackupRecord::with('creator')->orderByDesc('id')->get();
        return Inertia::render('Settings/Backup', [
            'backups' => $backups,
        ]);
    }

    public function createBackup(Request $request): RedirectResponse
    {
        try {
            $record = $this->backupService->createDatabaseBackup($request->user()?->id);
            return back()->with('success', "Database backup created successfully: {$record->filename}");
        } catch (\Exception $e) {
            return back()->with('error', "Backup generation failed: " . $e->getMessage());
        }
    }

    public function download(int $id): BinaryFileResponse|RedirectResponse
    {
        $record = BackupRecord::findOrFail($id);
        $filePath = storage_path("app/backups/{$record->filename}");

        if (!File::exists($filePath)) {
            return back()->with('error', 'Requested backup archive not found on disk.');
        }

        return response()->download($filePath, $record->filename);
    }

    public function restore(Request $request, int $id): RedirectResponse
    {
        try {
            $this->backupService->restoreDatabaseBackup($id);
            return back()->with('success', 'Database successfully restored from snapshot archive.');
        } catch (\InvalidArgumentException $e) {
            return back()->with('error', "Restore rejected: " . $e->getMessage());
        } catch (\Exception $e) {
            return back()->with('error', "Restore failed: " . $e->getMessage());
        }
    }
}
