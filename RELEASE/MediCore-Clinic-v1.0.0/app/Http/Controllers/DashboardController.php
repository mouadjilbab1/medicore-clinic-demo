<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\WaitingQueue;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Expense;
use App\Models\Doctor;
use App\Models\AuditLog;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $today = Carbon::today()->format('Y-m-d');
        $startOfMonth = Carbon::now()->startOfMonth()->format('Y-m-d');

        // 1. Patient KPIs
        $totalPatients = Patient::count();
        $newPatientsThisMonth = Patient::where('created_at', '>=', $startOfMonth)->count();

        // 2. Appointment KPIs
        $todayAppointments = Appointment::where('appointment_date', $today)->count();
        $completedToday = Appointment::where('appointment_date', $today)->where('status', 'completed')->count();
        $cancelledToday = Appointment::where('appointment_date', $today)->where('status', 'cancelled')->count();
        $waitingCount = WaitingQueue::where('status', 'waiting')->count();

        // 3. Financial KPIs
        $todayRevenue = (float) Payment::whereDate('payment_date', $today)->sum('amount');
        $monthlyRevenue = (float) Payment::where('payment_date', '>=', $startOfMonth)->sum('amount');
        $monthlyExpenses = (float) Expense::where('expense_date', '>=', $startOfMonth)->sum('amount');
        $netMonthlyProfit = $monthlyRevenue - $monthlyExpenses;
        $totalOutstanding = (float) Invoice::where('status', '!=', 'paid')->sum('balance_due');

        // 4. Doctor Performance Summary
        $doctorStats = Doctor::with('user')->get()->map(function ($doc) use ($today) {
            $todayAppts = Appointment::where('doctor_id', $doc->id)->where('appointment_date', $today)->count();
            $completedAppts = Appointment::where('doctor_id', $doc->id)->where('appointment_date', $today)->where('status', 'completed')->count();
            return [
                'id' => $doc->id,
                'name' => $doc->user ? $doc->user->name : 'Unknown Doctor',
                'specialty' => $doc->specialty,
                'today_appointments' => $todayAppts,
                'completed_appointments' => $completedAppts,
                'is_available' => $doc->is_available,
            ];
        });

        // 5. Weekly Revenue Trend (Last 7 days)
        $revenueTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $day = Carbon::today()->subDays($i);
            $dayStr = $day->format('Y-m-d');
            $rev = (float) Payment::whereDate('payment_date', $dayStr)->sum('amount');
            $revenueTrend[] = [
                'date' => $day->format('M d'),
                'amount' => $rev,
            ];
        }

        // 6. Upcoming Appointments Today
        $upcomingAppointments = Appointment::with(['patient', 'doctor.user', 'room'])
            ->where('appointment_date', $today)
            ->whereIn('status', ['scheduled', 'confirmed', 'arrived', 'waiting', 'in_consultation'])
            ->orderBy('start_time')
            ->limit(8)
            ->get();

        // 7. Recent Audit Activities
        $recentActivities = AuditLog::with('user')
            ->orderByDesc('id')
            ->limit(6)
            ->get();

        return Inertia::render('Dashboard/Index', [
            'metrics' => [
                'total_patients' => $totalPatients,
                'new_patients_month' => $newPatientsThisMonth,
                'today_appointments' => $todayAppointments,
                'completed_today' => $completedToday,
                'cancelled_today' => $cancelledToday,
                'waiting_count' => $waitingCount,
                'today_revenue' => $todayRevenue,
                'monthly_revenue' => $monthlyRevenue,
                'monthly_expenses' => $monthlyExpenses,
                'net_profit' => $netMonthlyProfit,
                'outstanding_balance' => $totalOutstanding,
            ],
            'doctor_stats' => $doctorStats,
            'revenue_trend' => $revenueTrend,
            'upcoming_appointments' => $upcomingAppointments,
            'recent_activities' => $recentActivities,
        ]);
    }
}
