<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\WaitingQueueController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\DentalController;
use App\Http\Controllers\OphthalmologyController;
use App\Http\Controllers\SpecialtyFormController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\FinancialController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\LaboratoryController;
use App\Http\Controllers\ImagingController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\InstallController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\PatientPortalController;

// 1. Installation Wizard Routes
Route::prefix('install')->name('install.')->group(function () {
    Route::get('/', [InstallController::class, 'index'])->name('index');
    Route::post('/test-db', [InstallController::class, 'testDbConnection'])->name('test-db');
    Route::post('/complete', [InstallController::class, 'completeInstallation'])->name('complete');
});

// 2. Authentication & Localization
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');
Route::post('/locale/set', [AuthController::class, 'setLocale'])->name('locale.set');
Route::post('/branch/switch', [AuthController::class, 'switchBranch'])->name('branch.switch')->middleware('auth');

// 3. Dedicated Patient Portal
Route::prefix('portal')->name('portal.')->group(function () {
    Route::get('/', [PatientPortalController::class, 'dashboard'])->name('dashboard');
    Route::post('/appointments/request', [PatientPortalController::class, 'requestAppointment'])->name('appointments.request');
});

// 4. Clinical System (Protected Staff Routes)
Route::middleware(['auth'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Patients
    Route::resource('patients', PatientController::class);
    Route::post('/patients/check-duplicates', [PatientController::class, 'checkDuplicates'])->name('patients.check-duplicates');
    Route::post('/patients/merge', [PatientController::class, 'merge'])->name('patients.merge');

    // Appointments & Scheduling
    Route::get('/appointments', [AppointmentController::class, 'index'])->name('appointments.index');
    Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');
    Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus'])->name('appointments.update-status');
    Route::get('/appointments/available-slots', [AppointmentController::class, 'getAvailableSlots'])->name('appointments.slots');

    // Waiting Room & Queue
    Route::get('/waiting-room', [WaitingQueueController::class, 'index'])->name('waiting-room.index');
    Route::post('/waiting-room/check-in', [WaitingQueueController::class, 'checkIn'])->name('waiting-room.check-in');
    Route::post('/waiting-room/{id}/call', [WaitingQueueController::class, 'callNext'])->name('waiting-room.call');
    Route::post('/waiting-room/{id}/complete', [WaitingQueueController::class, 'complete'])->name('waiting-room.complete');
    Route::post('/waiting-room/{id}/skip', [WaitingQueueController::class, 'skip'])->name('waiting-room.skip');
    Route::post('/waiting-room/{id}/transfer', [WaitingQueueController::class, 'transfer'])->name('waiting-room.transfer');
    Route::get('/waiting-room/display', [WaitingQueueController::class, 'publicDisplay'])->name('waiting-room.display');

    // Consultations & EMR
    Route::resource('consultations', ConsultationController::class);
    Route::post('/consultations/{id}/vitals', [ConsultationController::class, 'addVitals'])->name('consultations.vitals');
    Route::post('/consultations/{id}/diagnoses', [ConsultationController::class, 'addDiagnosis'])->name('consultations.diagnoses');
    Route::post('/consultations/{id}/sign', [ConsultationController::class, 'signAndFinalize'])->name('consultations.sign');
    Route::post('/consultations/{id}/revisions', [ConsultationController::class, 'addRevision'])->name('consultations.revisions');
    Route::post('/consultations/{id}/dermatology', [ConsultationController::class, 'addDermatology'])->name('consultations.dermatology');
    Route::post('/consultations/{id}/pediatrics', [ConsultationController::class, 'addPediatricGrowth'])->name('consultations.pediatrics');
    Route::post('/consultations/{id}/physiotherapy', [ConsultationController::class, 'addPhysiotherapy'])->name('consultations.physiotherapy');

    // Specialties - Dental FDI Odontogram
    Route::get('/specialties/dental', [DentalController::class, 'index'])->name('dental.index');
    Route::post('/specialties/dental/{patientId}/tooth/{toothNumber}', [DentalController::class, 'updateTooth'])->name('dental.tooth.update');
    Route::post('/specialties/dental/{patientId}/treatments', [DentalController::class, 'storeTreatment'])->name('dental.treatments.store');
    Route::patch('/specialties/dental/treatments/{id}/stage', [DentalController::class, 'updateTreatmentStage'])->name('dental.treatments.stage');

    // Specialties - Ophthalmology
    Route::get('/specialties/ophthalmology', [OphthalmologyController::class, 'index'])->name('ophthalmology.index');
    Route::post('/specialties/ophthalmology', [OphthalmologyController::class, 'store'])->name('ophthalmology.store');

    // Specialties - Form Builder
    Route::get('/specialties/form-builder', [SpecialtyFormController::class, 'index'])->name('form-builder.index');
    Route::post('/specialties/form-builder', [SpecialtyFormController::class, 'storeForm'])->name('form-builder.store');
    Route::get('/specialties/form-builder/{id}', [SpecialtyFormController::class, 'show'])->name('form-builder.show');
    Route::post('/specialties/form-builder/{id}/fields', [SpecialtyFormController::class, 'addField'])->name('form-builder.add-field');
    Route::post('/specialties/form-builder/{id}/responses', [SpecialtyFormController::class, 'submitResponse'])->name('form-builder.submit');

    // Prescriptions
    Route::resource('prescriptions', PrescriptionController::class)->only(['index', 'store', 'show']);
    Route::get('/prescriptions/{id}/print', [PrescriptionController::class, 'print'])->name('prescriptions.print');

    // Billing & Invoices
    Route::resource('billing', BillingController::class)->only(['index', 'store', 'show']);
    Route::post('/billing/{id}/payment', [BillingController::class, 'recordPayment'])->name('billing.payment');

    // Financial Management & Closing
    Route::get('/financial', [FinancialController::class, 'index'])->name('financial.index');
    Route::post('/financial/expenses', [FinancialController::class, 'storeExpense'])->name('financial.expenses.store');
    Route::post('/financial/close-register', [FinancialController::class, 'closeRegister'])->name('financial.close-register');

    // Inventory & Pharmacy
    Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::post('/inventory/products', [InventoryController::class, 'storeProduct'])->name('inventory.products.store');
    Route::post('/inventory/products/{id}/movement', [InventoryController::class, 'recordMovement'])->name('inventory.movement');

    // Laboratory
    Route::get('/laboratory', [LaboratoryController::class, 'index'])->name('laboratory.index');
    Route::post('/laboratory/requests', [LaboratoryController::class, 'storeRequest'])->name('laboratory.requests.store');
    Route::post('/laboratory/requests/{id}/result', [LaboratoryController::class, 'addResult'])->name('laboratory.result');

    // Imaging
    Route::get('/imaging', [ImagingController::class, 'index'])->name('imaging.index');
    Route::post('/imaging/requests', [ImagingController::class, 'storeRequest'])->name('imaging.requests.store');
    Route::post('/imaging/requests/{id}/report', [ImagingController::class, 'saveReport'])->name('imaging.report');

    // Staff & HR
    Route::get('/staff', [StaffController::class, 'index'])->name('staff.index');
    Route::post('/staff', [StaffController::class, 'store'])->name('staff.store');

    // Backups
    Route::get('/settings/backup', [BackupController::class, 'index'])->name('backups.index');
    Route::post('/settings/backup/create', [BackupController::class, 'createBackup'])->name('backups.create');
    Route::post('/settings/backup/{id}/restore', [BackupController::class, 'restore'])->name('backups.restore');
    Route::get('/settings/backup/{id}/download', [BackupController::class, 'download'])->name('backups.download');
});
