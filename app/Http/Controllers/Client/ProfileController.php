<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Affiche le profil de l'utilisateur connecté (côté client)
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Statistiques pour le profil
        $stats = [
            'total_reservations' => $user->reservations()->count(),
            'upcoming_reservations' => $user->reservations()->where('status', 'upcoming')->count(),
            'favorite_artists' => $user->clientProfile ? $user->clientProfile->followedArtists()->count() : 0,
        ];

        return Inertia::render('Client/Profile/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'city' => $user->city,
                'profile_photo' => $user->profile_photo,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'email_verified_at' => $user->email_verified_at,
            ],
            'stats' => $stats,
        ]);
    }
}
