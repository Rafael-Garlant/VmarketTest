<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SupplierRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    /**
     * regras de validação.
     */
    public function rules(): array
    {
        return [
            'name'  => ['required', 'string', 'max:255'],
            'cnpj'  => [
                'required',
                'string',
                'unique:suppliers,cnpj,' . ($this->supplier ? $this->supplier->id : 'NULL'),
            ],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string'],
            'active'=> ['required', 'boolean'],
        ];
    }

    // mensagens de erro personalizadas
    public function messages(): array
    {
        return [
            'name.required' => 'O nome do fornecedor é obrigatório.',
            'cnpj.required' => 'O CNPJ é obrigatório.',
            'cnpj.unique'   => 'Este CNPJ já está cadastrado no sistema.',
            'email.email'   => 'Insira um endereço de e-mail válido.',
            'active.required' => 'O status deve ser definido.',
        ];
    }
}
