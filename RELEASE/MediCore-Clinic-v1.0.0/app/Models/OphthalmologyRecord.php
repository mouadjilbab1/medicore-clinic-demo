<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OphthalmologyRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'consultation_id',
        'patient_id',
        'od_va_distance',
        'od_va_near',
        'od_sph',
        'od_cyl',
        'od_axis',
        'od_add',
        'od_iop',
        'os_va_distance',
        'os_va_near',
        'os_sph',
        'os_cyl',
        'os_axis',
        'os_add',
        'os_iop',
        'pd',
        'glasses_prescription_notes',
        'contact_lens_notes',
    ];

    protected $casts = [
        'od_sph' => 'decimal:2',
        'od_cyl' => 'decimal:2',
        'od_axis' => 'integer',
        'od_add' => 'decimal:2',
        'od_iop' => 'decimal:2',
        'os_sph' => 'decimal:2',
        'os_cyl' => 'decimal:2',
        'os_axis' => 'integer',
        'os_add' => 'decimal:2',
        'os_iop' => 'decimal:2',
        'pd' => 'decimal:2',
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
