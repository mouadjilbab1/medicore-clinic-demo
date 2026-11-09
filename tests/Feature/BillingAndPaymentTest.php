<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Branch;
use App\Models\Patient;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Services\BillingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class BillingAndPaymentTest extends TestCase
{
    use RefreshDatabase;

    protected User $cashier;
    protected Patient $patient;
    protected BillingService $billingService;

    protected function setUp(): void
    {
        parent::setUp();

        $clinic = Clinic::create([
            'name' => 'MediCore Clinic',
            'phone' => '+1 555-0100',
            'email' => 'contact@medicore.test',
            'address' => '123 Medical Center Way',
            'country' => 'Morocco',
            'currency' => 'USD',
            'timezone' => 'UTC',
        ]);

        $branch = Branch::create([
            'clinic_id' => $clinic->id,
            'name' => 'Main Branch',
            'code' => 'MAIN',
            'phone' => '+1 555-0100',
            'address' => '123 Medical Center Way',
            'is_main' => true,
            'is_active' => true,
        ]);

        $this->cashier = User::create([
            'branch_id' => $branch->id,
            'name' => 'Alice Cashier',
            'email' => 'cashier@medicore.test',
            'phone' => '+1 555-0400',
            'password' => Hash::make('secret123'),
            'role' => 'accountant',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->patient = Patient::create([
            'branch_id' => $branch->id,
            'patient_uid' => 'PAT-2026-0001',
            'first_name' => 'Michael',
            'last_name' => 'Scott',
            'date_of_birth' => '1975-03-15',
            'gender' => 'male',
            'phone' => '+1-555-5555',
            'is_active' => true,
        ]);

        $this->billingService = app(BillingService::class);
    }

    public function test_invoice_creation_and_number_generation(): void
    {
        $invNumber = $this->billingService->generateInvoiceNumber();
        $year = date('Y');
        $this->assertMatchesRegularExpression("/^INV-{$year}-\d{4}$/", $invNumber);
    }

    public function test_recording_payment_updates_balance_and_invoice_status(): void
    {
        // 1. Create an invoice with items totaling $300
        $invoice = Invoice::create([
            'branch_id' => 1,
            'patient_id' => $this->patient->id,
            'invoice_number' => $this->billingService->generateInvoiceNumber(),
            'invoice_date' => now()->toDateString(),
            'due_date' => now()->addDays(15)->toDateString(),
            'subtotal' => 300.00,
            'discount_amount' => 0.00,
            'tax_amount' => 0.00,
            'total_amount' => 300.00,
            'paid_amount' => 0.00,
            'balance_due' => 300.00,
            'status' => 'draft',
            'created_by' => $this->cashier->id,
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice->id,
            'item_type' => 'consultation',
            'item_name' => 'Specialist Consultation Fee',
            'unit_price' => 200.00,
            'quantity' => 1,
            'total' => 200.00,
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice->id,
            'item_type' => 'procedure',
            'item_name' => 'ECG Cardiac Rhythm Recording',
            'unit_price' => 100.00,
            'quantity' => 1,
            'total' => 100.00,
        ]);

        // 2. Record a partial payment of $100
        $payment1 = $this->billingService->recordPayment(
            $invoice->id,
            100.00,
            'cash',
            null,
            $this->cashier->id,
            'Partial initial deposit'
        );

        $invoice->refresh();
        $this->assertEquals(100.00, $invoice->paid_amount);
        $this->assertEquals(200.00, $invoice->balance_due);
        $this->assertEquals('partially_paid', $invoice->status);

        // 3. Record remaining payment of $200 via card
        $payment2 = $this->billingService->recordPayment(
            $invoice->id,
            200.00,
            'card',
            'TXN-998811',
            $this->cashier->id,
            'Final settlement'
        );

        $invoice->refresh();
        $this->assertEquals(300.00, $invoice->paid_amount);
        $this->assertEquals(0.00, $invoice->balance_due);
        $this->assertEquals('paid', $invoice->status);
    }
}
