<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WaitingQueue extends Model
{
    use HasFactory;

    protected $table = 'waiting_queue';

    protected $fillable = [
        'branch_id',
        'appointment_id',
        'patient_id',
        'doctor_id',
        'queue_number',
        'priority',
        'status',
        'check_in_time',
        'called_time',
        'completed_time',
        'notes',
    ];

    protected $casts = [
        'check_in_time' => 'datetime',
        'called_time' => 'datetime',
        'completed_time' => 'datetime',
        'queue_number' => 'integer',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

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
}
