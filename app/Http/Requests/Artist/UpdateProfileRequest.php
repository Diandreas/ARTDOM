<?php

namespace App\Http\Requests\Artist;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'stage_name' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['string'],
            'city' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'base_rate' => ['nullable', 'numeric', 'min:0', 'max:99999999'],
            'social_links' => ['nullable', 'array'],
            'social_links.facebook' => ['nullable', 'url', 'max:255'],
            'social_links.instagram' => ['nullable', 'url', 'max:255'],
            'social_links.youtube' => ['nullable', 'url', 'max:255'],
            'social_links.tiktok' => ['nullable', 'url', 'max:255'],
            'social_links.website' => ['nullable', 'url', 'max:255'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom complet est obligatoire.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'stage_name.required' => 'Le nom de scène est obligatoire.',
            'stage_name.max' => 'Le nom de scène ne peut pas dépasser 255 caractères.',
            'bio.max' => 'La biographie ne peut pas dépasser 1000 caractères.',
            'categories.*.string' => 'Chaque catégorie doit être une chaîne de caractères.',
            'city.max' => 'La ville ne peut pas dépasser 255 caractères.',
            'phone.max' => 'Le téléphone ne peut pas dépasser 20 caractères.',
            'base_rate.numeric' => 'Le tarif de base doit être un nombre.',
            'base_rate.min' => 'Le tarif de base doit être au moins 0.',
            'base_rate.max' => 'Le tarif de base ne peut pas dépasser 99999999.',
            'social_links.*.url' => 'Le lien doit être une URL valide.',
            'social_links.*.max' => 'Le lien ne peut pas dépasser 255 caractères.',
        ];
    }
}
