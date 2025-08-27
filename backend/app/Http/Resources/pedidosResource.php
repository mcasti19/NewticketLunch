<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class pedidosResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'numero_pedido' => $this->numero_pedido,
            'metodo_pago_id' => $this->metodo_pago_id,
            'referencia' => $this->referencia,
            'monto_total' => $this->monto_total,
            'id_menu' => $this->id_menu,
            'id_empleado' => $this->id_empleado
        ];
    }
}
