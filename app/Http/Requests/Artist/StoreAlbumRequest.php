<?php

namespace App\Http\Requests\Artist;

use Illuminate\Foundation\Http\FormRequest;

class StoreAlbumRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isArtist();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'year' => ['required', 'integer', 'min:1900', 'max:'.(date('Y') + 1)],
            'genre' => ['required', 'string', 'max:100'],
            'cover' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'], // 5MB
            'price' => ['nullable', 'numeric', 'min:0'],
            'is_free' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Le titre de l\'album est obligatoire.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            'year.required' => 'L\'année de sortie est obligatoire.',
            'year.integer' => 'L\'année doit être un nombre entier.',
            'year.min' => 'L\'année doit être supérieure à 1900.',
            'year.max' => 'L\'année ne peut pas être dans le futur.',
            'genre.required' => 'Le genre musical est obligatoire.',
            'cover.required' => 'La pochette de l\'album est obligatoire.',
            'cover.image' => 'La pochette doit être une image.',
            'cover.mimes' => 'La pochette doit être au format JPEG, JPG, PNG ou WEBP.',
            'cover.max' => 'La pochette ne peut pas dépasser 5 MB.',
            'price.numeric' => 'Le prix doit être un nombre.',
            'price.min' => 'Le prix ne peut pas être négatif.',
        ];
    }
}
