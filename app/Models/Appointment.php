<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'branch_id',
        'patient_id',
        'doctor_id',
        'room_id',
        'appointment_date',
        'start_time',
        'end_time',
        'type',
        'status',
        'reason_for_visit',
        'notes',
        'cancellation_reason',
        'created_by',
    ];

    protected $casts = [
        'appointment_date' => 'date',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function queueItem(): HasOne
    {
        return $this->hasOne(WaitingQueue::class);
    }

    public function consultation(): HasOne
    {
        return $this->hasOne(Consultation::class);
    }
}
