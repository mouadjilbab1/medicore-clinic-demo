<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SpecialtyFormResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_id',
        'consultation_id',
        'patient_id',
        'responses',
    ];

    protected $casts = [
        'responses' => 'array',
    ];

    public function form(): BelongsTo
    {
        return $this->belongsTo(SpecialtyForm::class, 'form_id');
    }

    public function consultation(): BelongsTo
    {
        return $this->belongsTo(Consultation::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}
