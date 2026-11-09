<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InsuranceCompany extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'contact_person',
        'phone',
        'email',
        'address',
        'discount_rate',
        'is_active',
    ];

    protected $casts = [
        'discount_rate' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function claims(): HasMany
    {
        return $this->hasMany(InsuranceClaim::class);
    }
}
