<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBroadcastNotificationRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:120'],
            'message' => ['required', 'string', 'max:5000'],
            'target_role' => ['required', Rule::in(['all', 'client', 'artist', 'admin'])],
            'only_active' => ['nullable', 'boolean'],
            'send_email' => ['nullable', 'boolean'],
            'action_url' => ['nullable', 'string', 'max:255'],
        ];
    }
}
