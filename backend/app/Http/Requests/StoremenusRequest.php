<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoremenusRequest extends FormRequest
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
            'sopa' => ['required', 'string'],
            'contourOne' => ['required', 'string'],
            'contourTwo' => ['required', 'string'],
            'saladOne' => ['required', 'string'],
            'saladTwo' => ['required', 'string'],
            'juice' => ['required', 'string'],
            'dessert' => ['required', 'string']
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'contour_one' => $this->contourOne,
            'contour_two' => $this->contourTwo,
            'salad_one' => $this->saladOne,
            'salad_two' => $this->saladTwo
        ]);
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => 404,
            //'message' => 'Errores del registro',
            'data' => $validator->errors()
        ]));
    }
}
