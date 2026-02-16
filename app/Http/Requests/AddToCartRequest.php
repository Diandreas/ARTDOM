<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddToCartRequest extends FormRequest
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
            'service_id' => 'required|uuid|exists:services,id',
            'quantity' => 'required|integer|min:1|max:10',
            'customization' => 'nullable|array',
            'customization.recipient_name' => 'nullable|string|max:255',
            'customization.emotion_type' => 'nullable|string|in:Joie,Amour,Soutien,Hommage,Fierté',
            'customization.message' => 'nullable|string|max:500',
            'customization.location_type' => 'nullable|string|in:home,online,public',
            'customization.location_address' => 'nullable|string|max:500',
            'scheduled_at' => 'required|date|after:now',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'service_id.required' => 'Le service est requis.',
            'service_id.exists' => 'Ce service n\'existe pas.',
            'quantity.required' => 'La quantité est requise.',
            'quantity.min' => 'La quantité doit être au moins 1.',
            'quantity.max' => 'La quantité ne peut pas dépasser 10.',
            'customization.emotion_type.in' => 'Le type d\'émotion doit être Joie, Amour, Soutien, Hommage ou Fierté.',
            'customization.message.max' => 'Le message ne peut pas dépasser 500 caractères.',
            'scheduled_at.required' => 'La date de réservation est requise.',
            'scheduled_at.after' => 'La date de réservation doit être dans le futur.',
        ];
    }
}
