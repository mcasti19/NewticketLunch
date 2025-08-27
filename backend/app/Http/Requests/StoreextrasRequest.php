<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreextrasRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombreExtra' => ['required', 'string'],
            'precioExtra' => ['required', 'string']
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'nombre_extra' => $this->nombreExtra,
            'precio_extra' => $this->precioExtra
        ]);
    }
}
