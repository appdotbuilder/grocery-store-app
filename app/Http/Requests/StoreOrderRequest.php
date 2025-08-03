<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
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
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'nullable|string|max:500',
            'delivery_type' => 'required|in:pickup,delivery',
            'notes' => 'nullable|string|max:500',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'customer_name.required' => 'Nama pelanggan wajib diisi.',
            'customer_phone.required' => 'Nomor HP wajib diisi.',
            'delivery_type.required' => 'Jenis pengiriman wajib dipilih.',
            'delivery_type.in' => 'Jenis pengiriman tidak valid.',
            'items.required' => 'Minimal harus ada 1 item dalam pesanan.',
            'items.min' => 'Minimal harus ada 1 item dalam pesanan.',
            'items.*.product_id.required' => 'ID produk wajib diisi.',
            'items.*.product_id.exists' => 'Produk tidak ditemukan.',
            'items.*.quantity.required' => 'Jumlah item wajib diisi.',
            'items.*.quantity.min' => 'Jumlah item minimal 1.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->delivery_type === 'pickup') {
            $this->merge([
                'customer_address' => null,
            ]);
        }
    }
}