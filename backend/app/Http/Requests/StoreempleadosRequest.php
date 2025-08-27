<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreempleadosRequest extends FormRequest
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
            'nombreCompleto' => ['required', 'string'],
            'cedula' => ['required', 'integer'],
            'idGerencia' => ['required', 'integer'],
            'estado' => ['required', 'string'],
            'tipoEmpleado' => ['required', 'string'],
            'cargo' => ['required', 'string']
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'nombre_completo' => $this->nombreCompleto,
            'id_gerencia' => $this->idGerencia,
            'tipo_empleado' => $this->tipoEmpleado
        ]);
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => 404,
            'data' => $validator->errors()
        ]));
    }
}
