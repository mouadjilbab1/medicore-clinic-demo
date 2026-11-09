<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'key',
        'value',
        'is_encrypted',
    ];

    protected $casts = [
        'is_encrypted' => 'boolean',
    ];

    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        if (!$setting) {
            return $default;
        }

        if ($setting->is_encrypted && !empty($setting->value)) {
            try {
                return decrypt($setting->value);
            } catch (\Exception $e) {
                return $default;
            }
        }

        return $setting->value ?? $default;
    }

    public static function set(string $key, mixed $value, string $category = 'general', bool $encrypt = false): void
    {
        $storedValue = $encrypt && !empty($value) ? encrypt($value) : $value;

        static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $storedValue,
                'category' => $category,
                'is_encrypted' => $encrypt,
            ]
        );
    }
}
