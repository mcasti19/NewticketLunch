<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class BlukStoreExtrasRequest extends FormRequest
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
            '*.nombreExtra' => ['required', 'string'],
            '*.precioExtra' => ['required', 'string']
        ];
    }

    protected function prepareForValidation()
    {
        $now = Carbon::now();
        $data = [];
        foreach ($this->toArray() as $obj) {
            $obj['nombre_extra'] = $obj['nombreExtra'] ?? NULL;
            $obj['precio_extra'] = $obj['precioExtra'] ?? NULL;
            $obj['created_at'] = $now;
            $obj['updated_at'] = $now;
            $data[] = $obj;
        }
        $this->merge($data);
    }
}
