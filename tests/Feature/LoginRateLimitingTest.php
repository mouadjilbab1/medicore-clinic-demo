<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Branch;
use App\Models\AuditLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

class LoginRateLimitingTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $clinic = Clinic::create([
            'name' => 'MediCore Clinic',
            'phone' => '+212522000000',
            'email' => 'contact@medicore.test',
            'address' => '100 Blvd Zerktouni',
        ]);

        $branch = Branch::create([
            'clinic_id' => $clinic->id,
            'name' => 'Main Center',
            'code' => 'BR01',
            'phone' => '+212522000001',
            'address' => '100 Blvd Zerktouni',
        ]);

        $this->user = User::create([
            'branch_id' => $branch->id,
            'name' => 'Dr. Rate Test',
            'email' => 'ratelimit@medicore.test',
            'password' => Hash::make('CorrectPassword123!'),
            'role' => 'doctor',
            'is_active' => true,
        ]);
    }

    public function test_normal_users_can_authenticate_without_lockout(): void
    {
        $response = $this->post(route('login'), [
            'email' => 'ratelimit@medicore.test',
            'password' => 'CorrectPassword123!',
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($this->user);
    }

    public function test_repeated_failed_logins_trigger_rate_limiter_lockout(): void
    {
        // 5 consecutive failed attempts
        for ($i = 1; $i <= 5; $i++) {
            $response = $this->post(route('login'), [
                'email' => 'ratelimit@medicore.test',
                'password' => 'WrongPassword!',
            ]);
            $response->assertSessionHasErrors('email');
            $this->assertGuest();
        }

        // 6th attempt must be throttled
        $response6 = $this->post(route('login'), [
            'email' => 'ratelimit@medicore.test',
            'password' => 'WrongPassword!',
        ]);

        $response6->assertSessionHasErrors(['email']);
        $errors = session('errors')->get('email');
        $this->assertTrue(
            str_contains($errors[0], 'Too many login attempts') ||
            str_contains($errors[0], 'seconds')
        );

        // Verify audit log has lockout entry
        $lockoutLog = AuditLog::where('action', 'login_lockout')->first();
        $this->assertNotNull($lockoutLog);
        $this->assertEquals('ratelimit@medicore.test', $lockoutLog->new_values['email']);
    }

    public function test_successful_login_clears_rate_limiter(): void
    {
        // 2 failed attempts
        $this->post(route('login'), ['email' => 'ratelimit@medicore.test', 'password' => 'Wrong1']);
        $this->post(route('login'), ['email' => 'ratelimit@medicore.test', 'password' => 'Wrong2']);

        // 3rd attempt is successful
        $response = $this->post(route('login'), [
            'email' => 'ratelimit@medicore.test',
            'password' => 'CorrectPassword123!',
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($this->user);
    }
}
