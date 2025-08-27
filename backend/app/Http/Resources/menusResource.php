<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class menusResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'sopa' => $this->sopa,
            'contour_one' => $this->contour_one,
            'contour_two' => $this->contour_two,
            'salad_one' => $this->salad_one,
            'salad_two' => $this->salad_two,
            'juice' => $this->juice,
            'dessert' => $this->dessert
        ];
    }
}
