<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'branch_id',
        'name',
        'email',
        'phone',
        'password',
        'role',
        'locale',
        'is_active',
        'avatar_path',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function doctor(): HasOne
    {
        return $this->hasOne(Doctor::class);
    }

    public function employee(): HasOne
    {
        return $this->hasOne(StaffEmployee::class);
    }

    public function isDoctor(): bool
    {
        return in_array($this->role, ['doctor', 'dentist']);
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'director', 'manager']);
    }

    public function getPermissionsAttribute(): array
    {
        $rolePermissions = [
            'admin' => ['*'],
            'director' => ['*'],
            'manager' => ['patients.*', 'appointments.*', 'doctors.*', 'billing.*', 'inventory.*', 'reports.*'],
            'doctor' => ['patients.view', 'patients.edit', 'appointments.view', 'consultations.*', 'prescriptions.*', 'emr.*', 'lab.*', 'imaging.*'],
            'dentist' => ['patients.view', 'patients.edit', 'appointments.view', 'consultations.*', 'prescriptions.*', 'emr.*', 'dental.*'],
            'nurse' => ['patients.view', 'appointments.view', 'queue.*', 'vitals.*'],
            'receptionist' => ['patients.create', 'patients.view', 'patients.edit', 'appointments.*', 'queue.*', 'billing.create', 'billing.view', 'payments.create'],
            'accountant' => ['billing.*', 'payments.*', 'expenses.*', 'reports.financial'],
            'pharmacist' => ['prescriptions.view', 'inventory.*'],
            'lab_tech' => ['lab.*'],
            'imaging_tech' => ['imaging.*'],
            'inventory_mgr' => ['inventory.*'],
            'patient' => ['portal.*'],
        ];

        return $rolePermissions[$this->role] ?? [];
    }
}
