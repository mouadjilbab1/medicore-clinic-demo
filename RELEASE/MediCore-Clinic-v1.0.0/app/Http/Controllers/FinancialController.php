<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\Expense;
use App\Models\Payment;
use App\Models\Invoice;
use App\Models\CashRegister;
use App\Models\Doctor;
use Carbon\Carbon;

class FinancialController extends Controller
{
    public function index(Request $request): Response
    {
        $month = $request->input('month', Carbon::now()->format('Y-m'));
        $startOfMonth = Carbon::parse($month)->startOfMonth()->toDateString();
        $endOfMonth = Carbon::parse($month)->endOfMonth()->toDateString();

        $monthlyRevenue = (float) Payment::whereBetween('payment_date', [$startOfMonth, $endOfMonth])->sum('amount');
        $monthlyExpenses = (float) Expense::whereBetween('expense_date', [$startOfMonth, $endOfMonth])->sum('amount');
        $netProfit = $monthlyRevenue - $monthlyExpenses;

        $expenses = Expense::with('recorder')
            ->whereBetween('expense_date', [$startOfMonth, $endOfMonth])
            ->orderByDesc('expense_date')
            ->get();

        $cashRegisters = CashRegister::with(['opener', 'closer'])
            ->orderByDesc('id')
            ->limit(10)
            ->get();

        // Doctor compensation ledger
        $doctors = Doctor::with('user')->get()->map(function ($doc) use ($startOfMonth, $endOfMonth) {
            $consultationTotal = Invoice::whereHas('items', function ($q) use ($doc) {
                $q->where('item_name', 'like', "%{$doc->user->name}%");
            })->whereBetween('invoice_date', [$startOfMonth, $endOfMonth])->sum('total_amount');

            $commissionAmount = $consultationTotal * ($doc->commission_rate / 100);

            return [
                'id' => $doc->id,
                'name' => $doc->user->name,
                'specialty' => $doc->specialty,
                'rate' => $doc->commission_rate,
                'total_billed' => (float) $consultationTotal,
                'commission_earned' => (float) $commissionAmount,
            ];
        });

        return Inertia::render('Financial/Index', [
            'metrics' => [
                'revenue' => $monthlyRevenue,
                'expenses' => $monthlyExpenses,
                'net_profit' => $netProfit,
                'selected_month' => $month,
            ],
            'expenses' => $expenses,
            'cash_registers' => $cashRegisters,
            'doctor_commissions' => $doctors,
        ]);
    }

    public function storeExpense(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category' => ['required', 'in:rent,salaries,utilities,supplies,maintenance,marketing,tax,other'],
            'title' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0.5'],
            'expense_date' => ['required', 'date'],
            'paid_to' => ['nullable', 'string', 'max:150'],
            'payment_method' => ['required', 'in:cash,card,bank_transfer,cheque,other'],
        ]);

        $validated['branch_id'] = $request->user()?->branch_id ?? 1;
        $validated['recorded_by'] = $request->user()?->id;

        Expense::create($validated);

        return back()->with('success', 'Operational expense entry recorded.');
    }

    public function closeRegister(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'physical_cash_counted' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $today = Carbon::today()->toDateString();
        $cashTotal = (float) Payment::whereDate('payment_date', $today)->where('payment_method', 'cash')->sum('amount');
        $cardTotal = (float) Payment::whereDate('payment_date', $today)->where('payment_method', 'card')->sum('amount');

        $counted = floatval($validated['physical_cash_counted']);
        $discrepancy = $counted - $cashTotal;

        CashRegister::create([
            'branch_id' => $request->user()?->branch_id ?? 1,
            'opened_by' => $request->user()->id,
            'closed_by' => $request->user()->id,
            'opening_balance' => 0.00,
            'closing_balance' => $counted,
            'system_cash_total' => $cashTotal,
            'system_card_total' => $cardTotal,
            'physical_cash_counted' => $counted,
            'discrepancy' => $discrepancy,
            'opened_at' => now()->startOfDay(),
            'closed_at' => now(),
            'status' => 'closed',
            'notes' => $validated['notes'] ?? null,
        ]);

        return back()->with('success', "Daily cash register closed. Discrepancy: {$discrepancy} MAD.");
    }
}
