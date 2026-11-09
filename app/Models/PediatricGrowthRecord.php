<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PediatricGrowthRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'consultation_id',
        'patient_id',
        'age_months',
        'height_cm',
        'height_percentile',
        'weight_kg',
        'weight_percentile',
        'head_circumference_cm',
        'head_percentile',
    ];

    protected $casts = [
        'age_months' => 'integer',
        'height_cm' => 'decimal:2',
        'height_percentile' => 'decimal:2',
        'weight_kg' => 'decimal:2',
        'weight_percentile' => 'decimal:2',
        'head_circumference_cm' => 'decimal:2',
        'head_percentile' => 'decimal:2',
    ];

    public function consultation(): BelongsTo
    {
        return $this->belongsTo(Consultation::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}
