<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\metodoPago;
use App\Models\empleados;
use App\Models\menus;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class pedidos extends Model
{
    /** @use HasFactory<\Database\Factories\PedidosFactory> */
    use HasFactory;

    protected $fillable = [
        'numero_pedido',
        'metodo_pago_id',
        'referencia',
        'monto_total',
        'id_menu',
        'id_empleado'
    ];

    public function metodoPago(): BelongsTo
    {
        return $this->belongsTo(MetodoPago::class, 'metodo_pago_id', 'id_metodo_pago');
    }
    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menus::class, 'id_menu', 'id_menu');
    }
    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleados::class, 'id_empleado', 'id_empleados');
    }
}
