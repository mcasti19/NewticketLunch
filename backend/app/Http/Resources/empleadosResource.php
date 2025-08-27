<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class empleadosResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'nombre_completo' => $this->nombre_completo,
            'cedula' => $this->cedula,
            'id_gerencia' => $this->id_gerencia,
            'estado' => $this->estado,
            'tipo_empleado' => $this->tipo_empleado,
            'cargo' => $this->cargo
        ];
    }
}
