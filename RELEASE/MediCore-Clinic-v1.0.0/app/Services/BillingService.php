<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;

class BillingService
{
    /**
     * Generate unique invoice number: INV-2026-0003
     */
    public function generateInvoiceNumber(): string
    {
        $year = date('Y');
        $last = Invoice::withTrashed()
            ->where('invoice_number', 'like', "INV-{$year}-%")
            ->orderByDesc('id')
            ->first();

        $seq = 1;
        if ($last) {
            $parts = explode('-', $last->invoice_number);
            $seq = intval(end($parts)) + 1;
        }

        return sprintf("INV-%s-%04d", $year, $seq);
    }

    /**
     * Generate unique payment receipt number: REC-2026-0003
     */
    public function generateReceiptNumber(): string
    {
        $year = date('Y');
        $last = Payment::where('receipt_number', 'like', "REC-{$year}-%")
            ->orderByDesc('id')
            ->first();

        $seq = 1;
        if ($last) {
            $parts = explode('-', $last->receipt_number);
            $seq = intval(end($parts)) + 1;
        }

        return sprintf("REC-%s-%04d", $year, $seq);
    }

    /**
     * Record a payment and automatically recalculate invoice balance and status.
     */
    public function recordPayment(int $invoiceId, float $amount, string $method, ?string $reference, int $receivedBy, ?string $notes = null): Payment
    {
        return DB::transaction(function () use ($invoiceId, $amount, $method, $reference, $receivedBy, $notes) {
            $invoice = Invoice::findOrFail($invoiceId);

            $payment = Payment::create([
                'invoice_id' => $invoice->id,
                'patient_id' => $invoice->patient_id,
                'receipt_number' => $this->generateReceiptNumber(),
                'amount' => $amount,
                'payment_method' => $method,
                'transaction_reference' => $reference,
                'payment_date' => now(),
                'received_by' => $receivedBy,
                'notes' => $notes,
            ]);

            $invoice->recalculateTotals();

            // Audit log
            AuditLog::create([
                'user_id' => $receivedBy,
                'action' => 'payment_recorded',
                'auditable_type' => Invoice::class,
                'auditable_id' => $invoice->id,
                'new_values' => ['payment_id' => $payment->id, 'amount' => $amount, 'method' => $method],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $payment;
        });
    }
}
