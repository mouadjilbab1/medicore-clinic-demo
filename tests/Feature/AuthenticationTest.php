<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Branch;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $clinic = Clinic::create([
            'name' => 'MediCore Clinic',
            'phone' => '+1 555-0100',
            'email' => 'contact@medicore.test',
            'address' => '123 Medical Center Way',
            'country' => 'Morocco',
            'currency' => 'USD',
            'timezone' => 'UTC',
        ]);

        $branch = Branch::create([
            'clinic_id' => $clinic->id,
            'name' => 'Main Branch',
            'code' => 'MAIN',
            'phone' => '+1 555-0100',
            'address' => '123 Medical Center Way',
            'is_main' => true,
            'is_active' => true,
        ]);

        User::create([
            'branch_id' => $branch->id,
            'name' => 'Doctor John',
            'email' => 'doctor@medicore.test',
            'phone' => '+1 555-0101',
            'password' => Hash::make('password123'),
            'role' => 'doctor',
            'locale' => 'en',
            'is_active' => true,
        ]);
    }

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_with_valid_credentials(): void
    {
        $response = $this->post('/login', [
            'email' => 'doctor@medicore.test',
            'password' => 'password123',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard'));
    }

    public function test_users_cannot_authenticate_with_invalid_password(): void
    {
        $response = $this->post('/login', [
            'email' => 'doctor@medicore.test',
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
    }
}
