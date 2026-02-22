<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RejectArtistValidationRequest extends FormRequest
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
            'reason' => [
                'required',
                Rule::in([
                    'incomplete_information',
                    'portfolio_quality',
                    'non_compliant_documents',
                    'duplicate_account',
                    'other',
                ]),
            ],
            'custom_message' => ['nullable', 'string', 'max:1500'],
            'allow_resubmission' => ['nullable', 'boolean'],
        ];
    }
}
