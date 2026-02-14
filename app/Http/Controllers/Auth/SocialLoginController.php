<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialLoginController extends Controller
{
    /**
     * Redirige vers le fournisseur OAuth (Google, Facebook, Apple)
     * 
     * Route: GET /auth/{provider}
     * Middleware: guest
     * 
     * @param string $provider Le fournisseur OAuth (google, facebook, apple)
     * 
     * Logique:
     * 1. Redirige vers la page de connexion du fournisseur
     * 2. Le fournisseur redirigera vers /auth/{provider}/callback
     */
    public function redirect(string $provider): RedirectResponse
    {
        // Valider que le provider est supporté
        $allowedProviders = ['google', 'facebook', 'apple'];
        if (!in_array($provider, $allowedProviders)) {
            abort(404, 'Provider non supporté');
        }

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Traite le callback du fournisseur OAuth
     * 
     * Route: GET /auth/{provider}/callback
     * Middleware: guest
     * 
     * @param string $provider Le fournisseur OAuth
     * 
     * Logique:
     * 1. Récupère les données utilisateur du fournisseur
     * 2. Cherche un utilisateur existant avec cet email
     * 3. Si trouvé: connecte l'utilisateur
     * 4. Si non trouvé: crée un nouvel utilisateur et le connecte
     * 5. Redirige vers le dashboard selon le rôle
     */
    public function callback(string $provider): RedirectResponse
    {
        try {
            // Récupérer les données utilisateur du fournisseur
            $socialUser = Socialite::driver($provider)->user();

            // Chercher un utilisateur existant avec cet email
            $user = User::where('email', $socialUser->getEmail())->first();

            if ($user) {
                // Utilisateur existant: connexion
                Auth::login($user, true);
            } else {
                // Nouvel utilisateur: création
                $user = User::create([
                    'email' => $socialUser->getEmail(),
                    'password' => Hash::make(Str::random(32)), // Mot de passe aléatoire
                    'role' => UserRole::Client, // Par défaut client
                    'profile_photo' => $socialUser->getAvatar(),
                    'email_verified_at' => now(), // Email déjà vérifié via OAuth
                ]);

                // Créer le profil client par défaut
                $user->clientProfile()->create([
                    'first_name' => $socialUser->getName() ?? 'Utilisateur',
                    'last_name' => '',
                ]);

                Auth::login($user, true);
            }

            // Redirection selon le rôle
            return match ($user->role) {
                UserRole::Client => redirect()->route('client.home'),
                UserRole::Artist => redirect()->route('artist.dashboard'),
                UserRole::Admin => redirect()->route('admin.dashboard'),
            };
        } catch (\Exception $e) {
            // En cas d'erreur, rediriger vers la page de connexion
            return redirect()->route('login')->withErrors([
                'email' => 'Erreur lors de la connexion avec '.ucfirst($provider).'. Veuillez réessayer.',
            ]);
        }
    }
}
