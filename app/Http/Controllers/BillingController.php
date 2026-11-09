<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\Patient;
use App\Models\Clinic;
use App\Services\BillingService;

class BillingController extends Controller
{
    public function __construct(protected BillingService $billingService)
    {
    }

    public function index(Request $request): Response
    {
        $status = $request->input('status');
        $search = $request->input('search');

        $query = Invoice::with(['patient', 'payments', 'items'])
            ->orderByDesc('id');

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhereHas('patient', function ($pq) use ($search) {
                      $pq->where('first_name', 'like', "%{$search}%")
                         ->orWhere('last_name', 'like', "%{$search}%")
                         ->orWhere('patient_uid', 'like', "%{$search}%");
                  });
            });
        }

        $invoices = $query->paginate(15)->withQueryString();
        $patients = Patient::where('is_active', true)->select('id', 'first_name', 'last_name', 'patient_uid')->get();

        return Inertia::render('Billing/Index', [
            'invoices' => $invoices,
            'patients' => $patients,
            'statusFilter' => $status,
            'searchFilter' => $search,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'due_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.item_name' => ['required', 'string', 'max:255'],
            'items.*.item_type' => ['required', 'in:consultation,procedure,medication,lab,imaging,dental'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.discount' => ['nullable', 'numeric', 'min:0'],
            'items.*.tax_rate' => ['nullable', 'numeric', 'min:0'],
        ]);

        $invoiceNumber = $this->billingService->generateInvoiceNumber();
        $subtotal = 0;
        $totalDiscount = 0;
        $totalTax = 0;

        foreach ($validated['items'] as $item) {
            $itemTotal = ($item['unit_price'] * $item['quantity']) - ($item['discount'] ?? 0);
            $subtotal += ($item['unit_price'] * $item['quantity']);
            $totalDiscount += ($item['discount'] ?? 0);
            $taxAmount = $itemTotal * (($item['tax_rate'] ?? 0) / 100);
            $totalTax += $taxAmount;
        }

        $totalAmount = max(0, $subtotal - $totalDiscount + $totalTax);

        $invoice = Invoice::create([
            'branch_id' => $request->user()?->branch_id ?? 1,
            'patient_id' => $validated['patient_id'],
            'invoice_number' => $invoiceNumber,
            'invoice_date' => now()->toDateString(),
            'due_date' => $validated['due_date'] ?? now()->toDateString(),
            'subtotal' => $subtotal,
            'discount_amount' => $totalDiscount,
            'tax_amount' => $totalTax,
            'total_amount' => $totalAmount,
            'paid_amount' => 0.00,
            'balance_due' => $totalAmount,
            'status' => 'unpaid',
            'notes' => $validated['notes'] ?? null,
            'created_by' => $request->user()?->id,
        ]);

        foreach ($validated['items'] as $item) {
            $itemTotal = ($item['unit_price'] * $item['quantity']) - ($item['discount'] ?? 0);
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'item_name' => $item['item_name'],
                'item_type' => $item['item_type'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'discount' => $item['discount'] ?? 0.00,
                'tax_rate' => $item['tax_rate'] ?? 0.00,
                'total' => $itemTotal,
            ]);
        }

        return redirect()->route('billing.show', $invoice->id)
            ->with('success', "Invoice #{$invoiceNumber} generated.");
    }

    public function show(int $id): Response
    {
        $invoice = Invoice::with(['patient', 'items', 'payments.receiver', 'branch'])->findOrFail($id);
        $clinic = Clinic::first();

        return Inertia::render('Billing/Show', [
            'invoice' => $invoice,
            'clinic' => $clinic,
        ]);
    }

    public function recordPayment(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1'],
            'payment_method' => ['required', 'in:cash,card,bank_transfer,insurance,cheque,other'],
            'transaction_reference' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $payment = $this->billingService->recordPayment(
            $id,
            floatval($validated['amount']),
            $validated['payment_method'],
            $validated['transaction_reference'] ?? null,
            $request->user()->id,
            $validated['notes'] ?? null
        );

        return back()->with('success', "Payment of {$payment->amount} MAD recorded. Receipt #{$payment->receipt_number}");
    }
}
