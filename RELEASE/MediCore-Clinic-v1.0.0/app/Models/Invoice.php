<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'branch_id',
        'patient_id',
        'consultation_id',
        'invoice_number',
        'invoice_date',
        'due_date',
        'subtotal',
        'discount_amount',
        'tax_amount',
        'total_amount',
        'paid_amount',
        'balance_due',
        'status',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'invoice_date' => 'date',
        'due_date' => 'date',
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'balance_due' => 'decimal:2',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function consultation(): BelongsTo
    {
        return $this->belongsTo(Consultation::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function recalculateTotals(): void
    {
        $grossSubtotal = 0;
        $totalDiscount = 0;
        $totalTax = 0;

        foreach ($this->items as $item) {
            $itemGross = floatval($item->unit_price) * intval($item->quantity);
            $itemNet = max(0, $itemGross - floatval($item->discount));
            $grossSubtotal += $itemGross;
            $totalDiscount += floatval($item->discount);
            $totalTax += $itemNet * (floatval($item->tax_rate) / 100.0);
        }

        $this->subtotal = $grossSubtotal;
        $this->discount_amount = $totalDiscount;
        $this->tax_amount = $totalTax;
        $this->total_amount = max(0, $grossSubtotal - $totalDiscount + $totalTax);
        $this->paid_amount = $this->payments->sum('amount');
        $this->balance_due = max(0, $this->total_amount - $this->paid_amount);

        if ($this->balance_due <= 0 && $this->total_amount > 0) {
            $this->status = 'paid';
        } elseif ($this->paid_amount > 0) {
            $this->status = 'partially_paid';
        }

        $this->save();
    }
}
