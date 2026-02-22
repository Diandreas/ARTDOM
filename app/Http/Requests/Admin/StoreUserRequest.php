<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'phone' => ['required', 'string', 'max:30', Rule::unique('users', 'phone')],
            'city' => ['nullable', 'string', 'max:100'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'max:30'],
            'profile_photo' => ['nullable', 'string', 'max:2048'],
            'role' => ['required', Rule::in(['client', 'artist', 'admin'])],
            'status' => ['required', Rule::in(['active', 'pending', 'suspended', 'banned'])],

            'stage_name' => ['nullable', 'string', 'max:120', 'required_if:role,artist'],
            'category' => ['nullable', 'string', 'max:120'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'base_rate' => ['nullable', 'numeric', 'min:0'],
            'portfolio_urls' => ['nullable', 'array'],
            'portfolio_urls.*' => ['string', 'max:2048'],

            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'mark_email_verified' => ['nullable', 'boolean'],
            'force_password_change' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'stage_name.required_if' => 'Le nom de scene est requis pour un compte artiste.',
        ];
    }
}
