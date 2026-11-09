<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SpecialtyForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'specialty_code',
        'version',
        'is_active',
        'description',
    ];

    protected $casts = [
        'version' => 'integer',
        'is_active' => 'boolean',
    ];

    public function fields(): HasMany
    {
        return $this->hasMany(SpecialtyFormField::class, 'form_id')->orderBy('order_index');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(SpecialtyFormResponse::class, 'form_id');
    }
}
