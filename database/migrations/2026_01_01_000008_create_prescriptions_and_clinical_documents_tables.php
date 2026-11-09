<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consultation_id')->nullable()->constrained('consultations')->nullOnDelete();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('doctor_id')->constrained('doctors')->cascadeOnDelete();
            $table->string('prescription_number', 50)->unique();
            $table->enum('status', ['active', 'dispensed', 'cancelled'])->default('active');
            $table->text('instructions')->nullable();
            $table->dateTime('signed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('prescription_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prescription_id')->constrained('prescriptions')->cascadeOnDelete();
            $table->string('medicine_name');
            $table->string('dosage', 100);
            $table->string('frequency', 100);
            $table->string('duration', 100);
            $table->string('route', 50)->default('oral'); // oral, topical, iv, im, inhalation, ophthalmic
            $table->unsignedSmallInteger('quantity')->default(1);
            $table->text('instructions')->nullable();
            $table->timestamps();
        });

        Schema::create('clinical_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('doctor_id')->constrained('doctors')->cascadeOnDelete();
            $table->enum('type', ['sick_leave', 'medical_certificate', 'referral_letter', 'fitness_certificate'])->default('medical_certificate');
            $table->string('document_number', 50)->unique();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('diagnosis_summary')->nullable();
            $table->longText('content');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clinical_documents');
        Schema::dropIfExists('prescription_items');
        Schema::dropIfExists('prescriptions');
    }
};
