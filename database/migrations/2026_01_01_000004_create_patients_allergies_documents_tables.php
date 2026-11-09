<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->string('patient_uid', 50)->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->enum('gender', ['male', 'female', 'other'])->default('male');
            $table->date('date_of_birth');
            $table->string('blood_group', 10)->nullable();
            $table->string('phone', 50)->index();
            $table->string('email')->nullable();
            $table->string('national_id', 50)->nullable()->index();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('marital_status', 50)->nullable();
            $table->string('occupation', 100)->nullable();
            $table->string('photo_path')->nullable();
            $table->unsignedBigInteger('insurance_company_id')->nullable();
            $table->string('insurance_policy_number', 100)->nullable();
            $table->text('allergies_summary')->nullable();
            $table->text('chronic_conditions_summary')->nullable();
            $table->text('medical_notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('merged_into_id')->nullable()->constrained('patients')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('patient_allergies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->string('allergen');
            $table->enum('allergy_type', ['drug', 'food', 'environmental', 'other'])->default('drug');
            $table->enum('severity', ['mild', 'moderate', 'severe', 'life_threatening'])->default('moderate');
            $table->text('reaction')->nullable();
            $table->date('noted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('patient_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->string('document_type', 50)->default('other'); // id_card, lab_report, imaging_scan, referral, consent_form, other
            $table->string('file_path');
            $table->unsignedBigInteger('file_size')->default(0);
            $table->string('mime_type', 100)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_documents');
        Schema::dropIfExists('patient_allergies');
        Schema::dropIfExists('patients');
    }
};
