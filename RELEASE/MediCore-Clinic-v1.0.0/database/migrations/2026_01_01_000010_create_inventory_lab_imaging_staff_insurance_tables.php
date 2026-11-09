<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Inventory Products & Batches
        Schema::create('inventory_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->string('name');
            $table->string('sku', 50)->unique();
            $table->string('barcode', 100)->nullable()->index();
            $table->enum('category', ['medication', 'disposable', 'dental_material', 'equipment', 'other'])->default('medication');
            $table->string('unit', 30)->default('box');
            $table->decimal('purchase_price', 10, 2)->default(0.00);
            $table->decimal('selling_price', 10, 2)->default(0.00);
            $table->integer('current_stock')->default(0);
            $table->integer('minimum_stock_alert')->default(10);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('inventory_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('inventory_products')->cascadeOnDelete();
            $table->string('batch_number', 50)->index();
            $table->date('expiry_date')->index();
            $table->integer('quantity_received');
            $table->integer('quantity_remaining');
            $table->timestamps();
        });

        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('inventory_products')->cascadeOnDelete();
            $table->foreignId('batch_id')->nullable()->constrained('inventory_batches')->nullOnDelete();
            $table->enum('movement_type', ['in', 'out', 'adjustment', 'consultation'])->default('in');
            $table->integer('quantity');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // 2. Laboratory
        Schema::create('lab_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consultation_id')->nullable()->constrained('consultations')->nullOnDelete();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('doctor_id')->constrained('doctors')->cascadeOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->string('test_name');
            $table->string('test_code', 50)->nullable();
            $table->enum('priority', ['routine', 'urgent', 'stat'])->default('routine');
            $table->enum('status', ['ordered', 'sample_collected', 'in_analysis', 'completed', 'approved'])->default('ordered')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('lab_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')->constrained('lab_requests')->cascadeOnDelete();
            $table->string('parameter_name');
            $table->string('result_value');
            $table->string('unit', 30)->nullable();
            $table->string('reference_range', 100)->nullable();
            $table->boolean('is_abnormal')->default(false);
            $table->text('remarks')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('approved_at')->nullable();
            $table->timestamps();
        });

        // 3. Diagnostic Imaging
        Schema::create('imaging_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consultation_id')->nullable()->constrained('consultations')->nullOnDelete();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('doctor_id')->constrained('doctors')->cascadeOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->enum('modality', ['xray', 'ultrasound', 'ct', 'mri', 'mammography', 'other'])->default('xray');
            $table->string('body_part');
            $table->text('clinical_indication')->nullable();
            $table->enum('status', ['requested', 'scheduled', 'completed', 'reported'])->default('requested')->index();
            $table->longText('report_text')->nullable();
            $table->string('file_path')->nullable();
            $table->foreignId('performed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // 4. Staff & HR
        Schema::create('staff_employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->string('employee_id', 50)->unique();
            $table->string('job_title', 100);
            $table->date('hire_date');
            $table->decimal('salary', 10, 2)->default(0.00);
            $table->string('emergency_contact')->nullable();
            $table->timestamps();
        });

        // 5. Insurance Management
        Schema::create('insurance_companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 50)->unique();
            $table->string('contact_person')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->decimal('discount_rate', 5, 2)->default(0.00);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('insurance_claims', function (Blueprint $table) {
            $table->id();
            $table->foreignId('insurance_company_id')->constrained('insurance_companies')->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('invoice_id')->constrained('invoices')->cascadeOnDelete();
            $table->string('claim_number', 50)->unique();
            $table->decimal('claimed_amount', 10, 2);
            $table->decimal('approved_amount', 10, 2)->default(0.00);
            $table->decimal('rejected_amount', 10, 2)->default(0.00);
            $table->enum('status', ['submitted', 'in_review', 'approved', 'rejected', 'settled'])->default('submitted');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('insurance_claims');
        Schema::dropIfExists('insurance_companies');
        Schema::dropIfExists('staff_employees');
        Schema::dropIfExists('imaging_requests');
        Schema::dropIfExists('lab_results');
        Schema::dropIfExists('lab_requests');
        Schema::dropIfExists('inventory_movements');
        Schema::dropIfExists('inventory_batches');
        Schema::dropIfExists('inventory_products');
    }
};
