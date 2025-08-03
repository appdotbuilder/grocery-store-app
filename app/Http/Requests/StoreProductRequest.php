<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'unit' => 'required|string|max:20',
            'stock' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'integer|min:0',
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
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.exists' => 'Kategori tidak ditemukan.',
            'name.required' => 'Nama produk wajib diisi.',
            'slug.unique' => 'Slug produk sudah digunakan.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format gambar harus: jpeg, png, jpg, gif, atau webp.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
            'price.required' => 'Harga wajib diisi.',
            'price.min' => 'Harga tidak boleh negatif.',
            'discount_price.lt' => 'Harga diskon harus lebih kecil dari harga normal.',
            'unit.required' => 'Satuan wajib diisi.',
            'stock.required' => 'Stok wajib diisi.',
            'stock.min' => 'Stok tidak boleh negatif.',
            'minimum_stock.required' => 'Stok minimum wajib diisi.',
            'minimum_stock.min' => 'Stok minimum tidak boleh negatif.',
        ];
    }
}