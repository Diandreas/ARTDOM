<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class RedirectAuthenticatedUser
{
    /**
     * Get the redirect path based on user role.
     */
    public static function redirectPath(): string
    {
        $user = Auth::user();

        if (! $user instanceof User) {
            return route('home');
        }

        return match (true) {
            $user->isArtist() => route('artist.dashboard'),
            $user->isClient() => route('dashboard'),
            $user->isAdmin() => route('dashboard'),
            default => route('home'),
        };
    }
}
