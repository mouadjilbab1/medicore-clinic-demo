<?php

namespace App\Services;

use App\Models\Patient;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;

class PatientService
{
    /**
     * Generate the next unique Patient UID (e.g. PAT-2026-0004).
     */
    public function generateUid(): string
    {
        $year = date('Y');
        $lastPatient = Patient::withTrashed()
            ->where('patient_uid', 'like', "PAT-{$year}-%")
            ->orderByDesc('id')
            ->first();

        if ($lastPatient) {
            $parts = explode('-', $lastPatient->patient_uid);
            $nextSeq = intval(end($parts)) + 1;
        } else {
            $nextSeq = 1;
        }

        return sprintf("PAT-%s-%04d", $year, $nextSeq);
    }

    /**
     * Detect duplicate patients by phone, national ID, or email.
     */
    public function findDuplicates(string $phone, ?string $nationalId = null, ?string $email = null, ?int $excludeId = null): array
    {
        $query = Patient::where('is_active', true);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        $query->where(function ($q) use ($phone, $nationalId, $email) {
            $q->where('phone', $phone);
            if (!empty($nationalId)) {
                $q->orWhere('national_id', $nationalId);
            }
            if (!empty($email)) {
                $q->orWhere('email', $email);
            }
        });

        return $query->get()->toArray();
    }

    /**
     * Merge source patient into target patient safely, transferring history and logging an audit trail.
     */
    public function mergePatients(int $sourceId, int $targetId, string $reason, int $userId): bool
    {
        return DB::transaction(function () use ($sourceId, $targetId, $reason, $userId) {
            $source = Patient::findOrFail($sourceId);
            $target = Patient::findOrFail($targetId);

            // Re-assign appointments
            $source->appointments()->update(['patient_id' => $target->id]);

            // Re-assign consultations
            $source->consultations()->update(['patient_id' => $target->id]);

            // Re-assign invoices
            $source->invoices()->update(['patient_id' => $target->id]);

            // Re-assign payments
            $source->payments()->update(['patient_id' => $target->id]);

            // Re-assign dental records
            $source->dentalTreatments()->update(['patient_id' => $target->id]);

            // Re-assign documents
            $source->documents()->update(['patient_id' => $target->id]);

            // Mark source as merged and inactive
            $source->update([
                'is_active' => false,
                'merged_into_id' => $target->id,
            ]);
            $source->delete(); // Soft delete

            // Create audit log entry
            AuditLog::create([
                'user_id' => $userId,
                'action' => 'merged',
                'auditable_type' => Patient::class,
                'auditable_id' => $target->id,
                'old_values' => ['source_patient_id' => $source->id, 'source_uid' => $source->patient_uid],
                'new_values' => ['reason' => $reason, 'target_uid' => $target->patient_uid],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return true;
        });
    }
}
