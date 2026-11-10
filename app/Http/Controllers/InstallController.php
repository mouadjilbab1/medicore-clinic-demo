<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Branch;

class InstallController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        if (file_exists(storage_path('installed'))) {
            return redirect()->route('login');
        }

        $phpVersion = phpversion();
        $isPhpOk = version_compare($phpVersion, '8.2.0', '>=');

        $requirements = [
            ['name' => 'PHP >= 8.2.0', 'satisfied' => $isPhpOk, 'current' => $phpVersion],
            ['name' => 'PDO Extension', 'satisfied' => extension_loaded('pdo'), 'current' => extension_loaded('pdo') ? 'Enabled' : 'Missing'],
            ['name' => 'OpenSSL Extension', 'satisfied' => extension_loaded('openssl'), 'current' => extension_loaded('openssl') ? 'Enabled' : 'Missing'],
            ['name' => 'Mbstring Extension', 'satisfied' => extension_loaded('mbstring'), 'current' => extension_loaded('mbstring') ? 'Enabled' : 'Missing'],
            ['name' => 'Fileinfo Extension', 'satisfied' => extension_loaded('fileinfo'), 'current' => extension_loaded('fileinfo') ? 'Enabled' : 'Missing'],
            ['name' => 'GD / Image Extension', 'satisfied' => extension_loaded('gd'), 'current' => extension_loaded('gd') ? 'Enabled' : 'Missing'],
            ['name' => 'Storage Directory Writable', 'satisfied' => is_writable(storage_path()), 'current' => is_writable(storage_path()) ? 'Writable' : 'Not Writable'],
            ['name' => 'Bootstrap Cache Writable', 'satisfied' => is_writable(base_path('bootstrap/cache')), 'current' => is_writable(base_path('bootstrap/cache')) ? 'Writable' : 'Not Writable'],
        ];

        $allSatisfied = collect($requirements)->every(fn ($r) => $r['satisfied']);

        return Inertia::render('Install/Wizard', [
            'requirements' => $requirements,
            'allSatisfied' => $allSatisfied,
        ]);
    }

    public function testDbConnection(Request $request)
    {
        $validated = $request->validate([
            'db_driver' => ['required', 'in:sqlite,mysql'],
            'db_host' => ['nullable', 'string'],
            'db_port' => ['nullable', 'numeric'],
            'db_name' => ['nullable', 'string'],
            'db_user' => ['nullable', 'string'],
            'db_password' => ['nullable', 'string'],
        ]);

        try {
            if ($validated['db_driver'] === 'sqlite') {
                return response()->json(['success' => true, 'message' => 'SQLite local database is active and ready.']);
            }

            $pdo = new \PDO(
                "mysql:host={$validated['db_host']};port={$validated['db_port']};dbname={$validated['db_name']}",
                $validated['db_user'],
                $validated['db_password'],
                [\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION]
            );

            return response()->json(['success' => true, 'message' => 'MySQL database connection established successfully.']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()], 422);
        }
    }

    public function completeInstallation(Request $request): RedirectResponse
    {
        if (file_exists(storage_path('installed'))) {
            return redirect()->route('login');
        }

        $validated = $request->validate([
            'clinic_name' => ['required', 'string', 'max:255'],
            'clinic_phone' => ['required', 'string', 'max:50'],
            'clinic_email' => ['required', 'email'],
            'clinic_address' => ['required', 'string'],
            'clinic_currency' => ['required', 'string', 'max:10'],
            'admin_name' => ['required', 'string', 'max:255'],
            'admin_email' => ['required', 'email'],
            'admin_password' => ['required', 'string', 'min:8'],
            'seed_demo_data' => ['boolean'],
            'db_driver' => ['nullable', 'in:sqlite,mysql'],
            'db_host' => ['nullable', 'string'],
            'db_port' => ['nullable', 'numeric'],
            'db_name' => ['nullable', 'string'],
            'db_user' => ['nullable', 'string'],
            'db_password' => ['nullable', 'string'],
        ]);

        // Configure database and write .env if provided
        $driver = $validated['db_driver'] ?? config('database.default', 'sqlite');
        $envPath = base_path('.env');
        if (File::exists($envPath)) {
            $envContent = File::get($envPath);
            $envContent = preg_replace('/^DB_CONNECTION=.*$/m', "DB_CONNECTION={$driver}", $envContent);
            if ($driver === 'mysql') {
                $host = $validated['db_host'] ?? '127.0.0.1';
                $port = $validated['db_port'] ?? '3306';
                $database = $validated['db_name'] ?? 'medicore_clinic';
                $username = $validated['db_user'] ?? 'root';
                $password = $validated['db_password'] ?? '';

                $envContent = preg_replace('/^DB_HOST=.*$/m', "DB_HOST={$host}", $envContent);
                $envContent = preg_replace('/^DB_PORT=.*$/m', "DB_PORT={$port}", $envContent);
                $envContent = preg_replace('/^DB_DATABASE=.*$/m', "DB_DATABASE={$database}", $envContent);
                $envContent = preg_replace('/^DB_USERNAME=.*$/m', "DB_USERNAME={$username}", $envContent);
                $envContent = preg_replace('/^DB_PASSWORD=.*$/m', "DB_PASSWORD=\"{$password}\"", $envContent);

                config([
                    'database.default' => 'mysql',
                    'database.connections.mysql.host' => $host,
                    'database.connections.mysql.port' => $port,
                    'database.connections.mysql.database' => $database,
                    'database.connections.mysql.username' => $username,
                    'database.connections.mysql.password' => $password,
                ]);
                DB::purge('mysql');
            } else {
                $sqlitePath = database_path('database.sqlite');
                if (!File::exists($sqlitePath)) {
                    File::put($sqlitePath, '');
                }
                $envContent = preg_replace('/^DB_DATABASE=.*$/m', "DB_DATABASE={$sqlitePath}", $envContent);
                config([
                    'database.default' => 'sqlite',
                    'database.connections.sqlite.database' => $sqlitePath,
                ]);
                DB::purge('sqlite');
            }
            File::put($envPath, $envContent);
        } else {
            if ($driver === 'sqlite') {
                $sqlitePath = database_path('database.sqlite');
                if (!File::exists($sqlitePath)) {
                    File::put($sqlitePath, '');
                }
            }
        }

        // Run migrations
        Artisan::call('migrate', ['--force' => true]);

        // Create or update Clinic
        $clinic = Clinic::firstOrCreate(['id' => 1], [
            'name' => $validated['clinic_name'],
            'phone' => $validated['clinic_phone'],
            'email' => $validated['clinic_email'],
            'address' => $validated['clinic_address'],
            'currency' => $validated['clinic_currency'],
            'country' => 'Morocco',
            'timezone' => 'Africa/Casablanca',
        ]);

        $branch = Branch::firstOrCreate(['id' => 1], [
            'clinic_id' => $clinic->id,
            'name' => 'Main Clinic',
            'code' => 'BRN-MAIN',
            'phone' => $validated['clinic_phone'],
            'address' => $validated['clinic_address'],
            'is_main' => true,
            'is_active' => true,
        ]);

        // Create Administrator
        User::updateOrCreate(
            ['email' => $validated['admin_email']],
            [
                'branch_id' => $branch->id,
                'name' => $validated['admin_name'],
                'password' => Hash::make($validated['admin_password']),
                'role' => 'admin',
                'locale' => 'ar',
                'is_active' => true,
            ]
        );

        if ($request->boolean('seed_demo_data')) {
            Artisan::call('db:seed', ['--force' => true]);
        }

        // Lock installer
        File::put(storage_path('installed'), json_encode([
            'installed_at' => now()->toIso8601String(),
            'version' => '1.0.0',
        ]));

        return redirect()->route('login')->with('success', 'MediCore Clinic installed successfully! You may now sign in.');
    }
}
