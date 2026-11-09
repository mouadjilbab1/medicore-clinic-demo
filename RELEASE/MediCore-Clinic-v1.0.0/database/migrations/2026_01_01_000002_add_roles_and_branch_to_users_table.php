<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('id')->constrained('branches')->nullOnDelete();
            $table->string('phone')->nullable()->after('email');
            $table->enum('role', [
                'admin',
                'director',
                'manager',
                'doctor',
                'dentist',
                'nurse',
                'receptionist',
                'accountant',
                'pharmacist',
                'lab_tech',
                'imaging_tech',
                'inventory_mgr',
                'patient'
            ])->default('doctor')->after('password');
            $table->string('locale', 10)->default('ar')->after('role');
            $table->boolean('is_active')->default(true)->after('locale');
            $table->string('avatar_path')->nullable()->after('is_active');
            $table->text('two_factor_secret')->nullable()->after('avatar_path');
            $table->text('two_factor_recovery_codes')->nullable()->after('two_factor_secret');
            $table->timestamp('two_factor_confirmed_at')->nullable()->after('two_factor_recovery_codes');
            $table->timestamp('last_login_at')->nullable()->after('two_factor_confirmed_at');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['branch_id']);
            $table->dropColumn([
                'branch_id',
                'phone',
                'role',
                'locale',
                'is_active',
                'avatar_path',
                'two_factor_secret',
                'two_factor_recovery_codes',
                'two_factor_confirmed_at',
                'last_login_at',
                'deleted_at'
            ]);
        });
    }
};
