<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('doctor_id')->constrained('doctors')->cascadeOnDelete();
            $table->foreignId('room_id')->nullable()->constrained('rooms')->nullOnDelete();
            $table->date('appointment_date')->index();
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('type', ['consultation', 'follow_up', 'procedure', 'emergency', 'walk_in'])->default('consultation');
            $table->enum('status', [
                'scheduled',
                'confirmed',
                'arrived',
                'waiting',
                'in_consultation',
                'completed',
                'cancelled',
                'no_show'
            ])->default('scheduled')->index();
            $table->text('reason_for_visit')->nullable();
            $table->text('notes')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['doctor_id', 'appointment_date', 'start_time']);
        });

        Schema::create('waiting_queue', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->foreignId('appointment_id')->nullable()->constrained('appointments')->nullOnDelete();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('doctor_id')->constrained('doctors')->cascadeOnDelete();
            $table->unsignedInteger('queue_number');
            $table->enum('priority', ['normal', 'urgent', 'emergency', 'special_needs'])->default('normal');
            $table->enum('status', ['waiting', 'called', 'in_consultation', 'completed', 'skipped'])->default('waiting')->index();
            $table->dateTime('check_in_time');
            $table->dateTime('called_time')->nullable();
            $table->dateTime('completed_time')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waiting_queue');
        Schema::dropIfExists('appointments');
    }
};
