<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SpecialtyFormField extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_id',
        'label',
        'field_key',
        'field_type',
        'is_required',
        'validation_rules',
        'options',
        'order_index',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'validation_rules' => 'array',
        'options' => 'array',
        'order_index' => 'integer',
    ];

    public function form(): BelongsTo
    {
        return $this->belongsTo(SpecialtyForm::class, 'form_id');
    }
}
