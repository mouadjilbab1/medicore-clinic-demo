<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'app' => 'MediCore Clinic Management System',
        'version' => '1.0.0',
        'timestamp' => now()->toISOString(),
    ]);
});
