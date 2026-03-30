<?php

namespace App\Http\Requests;

use App\Models\Track;
use App\Models\TrackComment;
use Illuminate\Foundation\Http\FormRequest;

class StoreTrackCommentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Track|null $track */
        $track = $this->route('track');

        return [
            'content' => ['required', 'string', 'max:1000'],
            'parent_id' => [
                'nullable',
                'exists:track_comments,id',
                function (string $attribute, mixed $value, \Closure $fail) use ($track): void {
                    if ($value === null || $track === null) {
                        return;
                    }

                    $parentComment = TrackComment::query()
                        ->where('track_id', $track->id)
                        ->whereKey($value)
                        ->first();

                    if ($parentComment === null) {
                        $fail('Le commentaire parent ne correspond pas à cette musique.');
                    }
                },
            ],
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
            'content.required' => 'Le commentaire est requis.',
            'content.max' => 'Le commentaire ne peut pas dépasser 1000 caractères.',
            'parent_id.exists' => 'Le commentaire parent sélectionné est invalide.',
        ];
    }
}
