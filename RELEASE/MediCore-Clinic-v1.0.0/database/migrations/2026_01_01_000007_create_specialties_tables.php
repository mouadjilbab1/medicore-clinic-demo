<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Dental Module
        Schema::create('dental_teeth', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->unsignedTinyInteger('tooth_number')->index(); // FDI: 11-48, 51-85
            $table->string('surface_occlusal', 30)->default('healthy');
            $table->string('surface_mesial', 30)->default('healthy');
            $table->string('surface_distal', 30)->default('healthy');
            $table->string('surface_buccal', 30)->default('healthy');
            $table->string('surface_lingual', 30)->default('healthy');
            $table->string('overall_condition', 50)->default('healthy'); // healthy, caries, filled, missing, crown, root_canal, implant, extraction_planned, extracted, bridge
            $table->unsignedTinyInteger('mobility_grade')->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['patient_id', 'tooth_number']);
        });

        Schema::create('dental_treatments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('doctor_id')->constrained('doctors')->cascadeOnDelete();
            $table->foreignId('consultation_id')->nullable()->constrained('consultations')->nullOnDelete();
            $table->unsignedTinyInteger('tooth_number')->nullable();
            $table->string('procedure_name');
            $table->enum('stage', ['planned', 'in_progress', 'completed'])->default('planned');
            $table->decimal('cost', 10, 2)->default(0.00);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 2. Ophthalmology Module
        Schema::create('ophthalmology_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consultation_id')->constrained('consultations')->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->string('od_va_distance', 20)->nullable();
            $table->string('od_va_near', 20)->nullable();
            $table->decimal('od_sph', 5, 2)->nullable();
            $table->decimal('od_cyl', 5, 2)->nullable();
            $table->unsignedSmallInteger('od_axis')->nullable();
            $table->decimal('od_add', 5, 2)->nullable();
            $table->decimal('od_iop', 5, 2)->nullable();
            $table->string('os_va_distance', 20)->nullable();
            $table->string('os_va_near', 20)->nullable();
            $table->decimal('os_sph', 5, 2)->nullable();
            $table->decimal('os_cyl', 5, 2)->nullable();
            $table->unsignedSmallInteger('os_axis')->nullable();
            $table->decimal('os_add', 5, 2)->nullable();
            $table->decimal('os_iop', 5, 2)->nullable();
            $table->decimal('pd', 5, 2)->nullable();
            $table->text('glasses_prescription_notes')->nullable();
            $table->text('contact_lens_notes')->nullable();
            $table->timestamps();
        });

        // 3. Dermatology Module
        Schema::create('dermatology_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consultation_id')->constrained('consultations')->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->string('body_location_key', 50)->default('face');
            $table->string('condition_type', 100);
            $table->text('lesion_description')->nullable();
            $table->string('before_photo_path')->nullable();
            $table->string('after_photo_path')->nullable();
            $table->unsignedInteger('session_number')->default(1);
            $table->timestamps();
        });

        // 4. Pediatrics Module
        Schema::create('pediatric_growth_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consultation_id')->nullable()->constrained('consultations')->nullOnDelete();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->unsignedSmallInteger('age_months');
            $table->decimal('height_cm', 5, 2)->nullable();
            $table->decimal('height_percentile', 5, 2)->nullable();
            $table->decimal('weight_kg', 5, 2)->nullable();
            $table->decimal('weight_percentile', 5, 2)->nullable();
            $table->decimal('head_circumference_cm', 5, 2)->nullable();
            $table->decimal('head_percentile', 5, 2)->nullable();
            $table->timestamps();
        });

        // 5. Physiotherapy Module
        Schema::create('physiotherapy_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consultation_id')->nullable()->constrained('consultations')->nullOnDelete();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('therapist_id')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedTinyInteger('pain_vas_score')->default(0); // 0-10
            $table->string('mobility_score', 50)->nullable();
            $table->string('joint_assessed', 100)->nullable();
            $table->string('rom_measurement', 100)->nullable();
            $table->text('exercises_prescribed')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 6. Extensible Specialty Form Builder Engine
        Schema::create('specialty_forms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('specialty_code', 50)->index();
            $table->unsignedInteger('version')->default(1);
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('specialty_form_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained('specialty_forms')->cascadeOnDelete();
            $table->string('label');
            $table->string('field_key', 100);
            $table->string('field_type', 50); // text, textarea, number, date, select, multiselect, checkbox, radio, measurement, repeater
            $table->boolean('is_required')->default(false);
            $table->json('validation_rules')->nullable();
            $table->json('options')->nullable();
            $table->unsignedSmallInteger('order_index')->default(0);
            $table->timestamps();
        });

        Schema::create('specialty_form_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained('specialty_forms')->cascadeOnDelete();
            $table->foreignId('consultation_id')->constrained('consultations')->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->json('responses');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('specialty_form_responses');
        Schema::dropIfExists('specialty_form_fields');
        Schema::dropIfExists('specialty_forms');
        Schema::dropIfExists('physiotherapy_sessions');
        Schema::dropIfExists('pediatric_growth_records');
        Schema::dropIfExists('dermatology_records');
        Schema::dropIfExists('ophthalmology_records');
        Schema::dropIfExists('dental_treatments');
        Schema::dropIfExists('dental_teeth');
    }
};
