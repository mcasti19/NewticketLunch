<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\gerencia;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class empleados extends Model
{
    /** @use HasFactory<\Database\Factories\EmpleadosFactory> */
    use HasFactory;


    protected $fillable = [
        'nombre_completo',
        'cedula',
        'id_gerencia', 
        'estado',
        'tipo_empleado',
        'cargo'
    ];

    public function gerencia(): BelongsTo
    {
        return $this->belongsTo(Gerencia::class, 'id_gerencia', 'id_gerencia');
    }
}
