<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Enums\UserRole;
use App\Models\ArtistProfile;
use App\Models\ClientProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'role' => ['required', Rule::enum(UserRole::class)],
            'phone' => ['nullable', 'string', 'max:20'],
            'city' => ['nullable', 'string', 'max:255'],
            // Artist specific validation
            'stage_name' => ['required_if:role,artist', 'nullable', 'string', 'max:255'],
            'category' => ['required_if:role,artist', 'nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ])->validate();

        return DB::transaction(function () use ($input) {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'role' => $input['role'],
                'phone' => $input['phone'] ?? null,
                'city' => $input['city'] ?? null,
                'is_active' => true,
            ]);

            if ($input['role'] === UserRole::Artist->value) {
                ArtistProfile::create([
                    'user_id' => $user->id,
                    'stage_name' => $input['stage_name'],
                    'bio' => $input['bio'] ?? null,
                    'categories' => json_encode([$input['category']]),
                    'verification_status' => 'pending',
                ]);
            } else {
                ClientProfile::create([
                    'user_id' => $user->id,
                    'first_name' => $input['name'], // Using name as first_name for now
                ]);
            }

            return $user;
        });
    }
}
