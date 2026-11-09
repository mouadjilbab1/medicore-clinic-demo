<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BackupRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'filename',
        'disk',
        'file_size',
        'backup_type',
        'status',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
