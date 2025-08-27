<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class BlukStoreEmpleadosRequest extends FormRequest
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
            '*.nombreCompleto' => ['required', 'string'],
            '*.cedula' => ['required', 'integer'],
            '*.idGerencia' => ['required', 'integer'],
            '*.estado' => ['required', 'string'],
            '*.tipoEmpleado' => ['required', 'string'],
            '*.cargo' => ['required', 'string']
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => 404,
            'data' => $validator->errors()
        ]));
    }
    protected function prepareForValidation()
    {   
        $now = Carbon::now();
        $data = [];

        foreach ($this->toArray() as $obj) {
            $obj['nombre_completo'] = $obj['nombreCompleto'] ?? NULL;
            $obj['id_gerencia'] = $obj['idGerencia'] ?? NULL;
            $obj['tipo_empleado'] = $obj['tipoEmpleado'] ?? NULL;
            $obj['created_at'] = $now;
            $obj['updated_at'] = $now;
            $data[] = $obj;
        }

        $this->merge($data);
    }
}
