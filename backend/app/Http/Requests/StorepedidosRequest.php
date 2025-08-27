<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StorepedidosRequest extends FormRequest
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
            'numeroPedido' => ['required', 'integer'],
            'metodoPagoId' => ['required', 'integer'],
            'referencia' => ['required', 'integer'],
            'montoTotal' => ['required', 'integer'],
            'idMenu' => ['required', 'integer'],
            'idEmpleado' => ['required', 'integer']
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'numero_pedido' => $this->numeroPedido,
            'metodo_pago_id' => $this->metodoPagoId,
            'monto_total' => $this->montoTotal,
            'id_menu' => $this->idMenu,
            'id_empleado' => $this->idEmpleado
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
