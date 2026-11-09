<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'branch_id',
        'patient_uid',
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'blood_group',
        'phone',
        'email',
        'national_id',
        'address',
        'city',
        'emergency_contact_name',
        'emergency_contact_phone',
        'marital_status',
        'occupation',
        'photo_path',
        'insurance_company_id',
        'insurance_policy_number',
        'allergies_summary',
        'chronic_conditions_summary',
        'medical_notes',
        'is_active',
        'merged_into_id',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'is_active' => 'boolean',
    ];

    protected $appends = ['full_name', 'age'];

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getAgeAttribute(): ?int
    {
        return $this->date_of_birth ? $this->date_of_birth->age : null;
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function allergies(): HasMany
    {
        return $this->hasMany(PatientAllergy::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(PatientDocument::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function consultations(): HasMany
    {
        return $this->hasMany(Consultation::class);
    }

    public function prescriptions(): HasMany
    {
        return $this->hasMany(Prescription::class);
    }

    public function dentalTeeth(): HasMany
    {
        return $this->hasMany(DentalTooth::class);
    }

    public function dentalTreatments(): HasMany
    {
        return $this->hasMany(DentalTreatment::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function vitals(): HasMany
    {
        return $this->hasMany(VitalSign::class);
    }

    public function mergedInto(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'merged_into_id');
    }
}
