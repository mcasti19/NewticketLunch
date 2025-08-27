<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class gerencia extends Model
{
    /** @use HasFactory<\Database\Factories\GerenciaFactory> */
    use HasFactory;



    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'id_gerencia');
    }
    public function empleados(): HasMany
    {
        return $this->hasMany(User::class, 'id_gerencia');
    }
}
