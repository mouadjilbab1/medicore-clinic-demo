<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DentalTooth extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'tooth_number',
        'surface_occlusal',
        'surface_mesial',
        'surface_distal',
        'surface_buccal',
        'surface_lingual',
        'overall_condition',
        'mobility_grade',
        'notes',
        'updated_by',
    ];

    protected $casts = [
        'tooth_number' => 'integer',
        'mobility_grade' => 'integer',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
