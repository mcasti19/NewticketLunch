<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class extras extends Model
{
    /** @use HasFactory<\Database\Factories\ExtrasFactory> */
    use HasFactory;

    protected $fillable = [
        'nombre_extra',
        'precio_extra'
    ];
}
