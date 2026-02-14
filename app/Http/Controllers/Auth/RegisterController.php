<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\ArtistProfile;
use App\Models\ClientProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    /**
     * Affiche le formulaire d'inscription
     * 
     * Route: GET /register
     * Middleware: guest (seulement pour les utilisateurs non connectés)
     * 
     * Retourne la page Inertia 'Auth/Register' qui sera rendue côté frontend
     */
    public function showForm(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Traite l'inscription d'un nouvel utilisateur
     * 
     * Route: POST /register
     * Middleware: guest
     * 
     * Logique:
     * 1. Valide les données du formulaire
     * 2. Crée l'utilisateur (User)
     * 3. Crée le profil correspondant (ClientProfile ou ArtistProfile) selon le rôle
     * 4. Envoie l'email de vérification
     * 5. Redirige vers le dashboard selon le rôle
     */
    public function store(Request $request): RedirectResponse
    {
        // Validation des données de base
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone' => ['nullable', 'string', 'max:20', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', 'in:client,artist'],
            'city' => ['nullable', 'string', 'max:255'],
        ]);

        // Création de l'utilisateur
        $user = User::create([
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => UserRole::from($validated['role']),
            'city' => $validated['city'] ?? null,
        ]);

        // Création du profil selon le rôle
        if ($validated['role'] === 'client') {
            // Validation spécifique client
            $clientData = $request->validate([
                'first_name' => ['required', 'string', 'max:255'],
                'last_name' => ['required', 'string', 'max:255'],
                'date_of_birth' => ['nullable', 'date'],
                'gender' => ['nullable', 'string'],
            ]);

            ClientProfile::create([
                'user_id' => $user->id,
                'first_name' => $clientData['first_name'],
                'last_name' => $clientData['last_name'],
                'date_of_birth' => $clientData['date_of_birth'] ?? null,
                'gender' => $clientData['gender'] ?? null,
            ]);
        } else {
            // Validation spécifique artiste
            $artistData = $request->validate([
                'stage_name' => ['required', 'string', 'max:255'],
                'bio' => ['nullable', 'string', 'max:1000'],
                'categories' => ['nullable', 'array'],
                'base_rate' => ['nullable', 'numeric', 'min:0'],
            ]);

            ArtistProfile::create([
                'user_id' => $user->id,
                'stage_name' => $artistData['stage_name'],
                'bio' => $artistData['bio'] ?? null,
                'categories' => $artistData['categories'] ?? null,
                'base_rate' => $artistData['base_rate'] ?? 0,
                'verification_status' => 'pending', // En attente de validation admin
            ]);
        }

        // Envoi de l'email de vérification
        $user->sendEmailVerificationNotification();

        // Connexion automatique après inscription
        auth()->login($user);

        // Redirection selon le rôle
        return match ($user->role) {
            UserRole::Client => redirect()->route('client.home'),
            UserRole::Artist => redirect()->route('artist.dashboard'),
            default => redirect()->route('home'),
        };
    }
}
