<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Clinic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;

class InstallationWizardTest extends TestCase
{
    use RefreshDatabase;

    protected string $installedLockFile;

    protected function setUp(): void
    {
        parent::setUp();
        $this->installedLockFile = storage_path('installed');
    }

    public function test_installer_is_locked_when_lock_file_exists(): void
    {
        // Ensure installed lock exists
        File::put($this->installedLockFile, json_encode(['installed_at' => now()->toIso8601String()]));

        $response = $this->get('/install');
        $response->assertRedirect('/login');

        $responsePost = $this->post('/install/complete', [
            'clinic_name' => 'Hacked Clinic',
        ]);
        $responsePost->assertRedirect('/login');
    }

    public function test_installer_renders_requirements_when_not_installed(): void
    {
        if (File::exists($this->installedLockFile)) {
            File::delete($this->installedLockFile);
        }

        try {
            $response = $this->get('/install');
            $response->assertStatus(200);
        } finally {
            // Restore installed lock
            File::put($this->installedLockFile, json_encode(['installed_at' => now()->toIso8601String()]));
        }
    }

    public function test_installer_db_test_endpoint_returns_json_response(): void
    {
        if (File::exists($this->installedLockFile)) {
            File::delete($this->installedLockFile);
        }

        try {
            $response = $this->postJson('/install/test-db', [
                'db_driver' => 'sqlite',
            ]);
            $response->assertStatus(200);
            $response->assertJson([
                'success' => true,
            ]);
        } finally {
            File::put($this->installedLockFile, json_encode(['installed_at' => now()->toIso8601String()]));
        }
    }
}
