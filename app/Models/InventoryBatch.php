<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryBatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'batch_number',
        'expiry_date',
        'quantity_received',
        'quantity_remaining',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'quantity_received' => 'integer',
        'quantity_remaining' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(InventoryProduct::class, 'product_id');
    }
}
