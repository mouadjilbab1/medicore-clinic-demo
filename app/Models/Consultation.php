<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Consultation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'appointment_id',
        'patient_id',
        'doctor_id',
        'branch_id',
        'consultation_date',
        'chief_complaint',
        'history_present_illness',
        'physical_examination',
        'clinical_assessment',
        'treatment_plan',
        'follow_up_instructions',
        'follow_up_date',
        'is_finalized',
        'signed_at',
        'signed_by',
    ];

    protected $casts = [
        'consultation_date' => 'datetime',
        'follow_up_date' => 'date',
        'is_finalized' => 'boolean',
        'signed_at' => 'datetime',
    ];

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function signer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'signed_by');
    }

    public function vitals(): HasMany
    {
        return $this->hasMany(VitalSign::class);
    }

    public function diagnoses(): HasMany
    {
        return $this->hasMany(Diagnosis::class);
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(ClinicalNoteRevision::class);
    }

    public function prescriptions(): HasMany
    {
        return $this->hasMany(Prescription::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    public function ophthalmologyRecord(): HasOne
    {
        return $this->hasOne(OphthalmologyRecord::class);
    }

    public function dermatologyRecord(): HasOne
    {
        return $this->hasOne(DermatologyRecord::class);
    }
}
