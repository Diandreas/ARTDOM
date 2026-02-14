<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    /**
     * Affiche le formulaire de connexion
     * 
     * Route: GET /login
     * Middleware: guest
     * 
     * Retourne la page Inertia 'Auth/Login'
     */
    public function showForm(): Response
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Traite la connexion d'un utilisateur
     * 
     * Route: POST /login
     * Middleware: guest
     * 
     * Logique:
     * 1. Valide les identifiants (email/phone + password)
     * 2. Tente l'authentification
     * 3. Vérifie que le compte est actif
     * 4. Redirige vers le dashboard selon le rôle
     */
    public function store(Request $request): RedirectResponse
    {
        // Validation des identifiants
        $credentials = $request->validate([
            'email' => ['required_without:phone', 'string', 'email'],
            'phone' => ['required_without:email', 'string'],
            'password' => ['required', 'string'],
            'remember' => ['boolean'],
        ]);

        // Déterminer le champ d'identification (email ou phone)
        $field = $request->filled('email') ? 'email' : 'phone';
        $value = $request->input($field);

        // Tentative d'authentification
        if (Auth::attempt([$field => $value, 'password' => $request->password], $request->boolean('remember'))) {
            $request->session()->regenerate();

            $user = Auth::user();

            // Vérifier que le compte est actif
            if (!$user->is_active) {
                Auth::logout();
                return back()->withErrors([
                    'email' => 'Votre compte a été désactivé. Veuillez contacter le support.',
                ]);
            }

            // Redirection selon le rôle
            return match ($user->role) {
                UserRole::Client => redirect()->intended(route('client.home')),
                UserRole::Artist => redirect()->intended(route('artist.dashboard')),
                UserRole::Admin => redirect()->intended(route('admin.dashboard')),
            };
        }

        // Échec de l'authentification
        return back()->withErrors([
            'email' => 'Les identifiants fournis ne correspondent pas à nos enregistrements.',
        ])->onlyInput('email');
    }

    /**
     * Déconnecte l'utilisateur
     * 
     * Route: DELETE /logout
     * Middleware: auth (seulement pour les utilisateurs connectés)
     * 
     * Logique:
     * 1. Déconnecte l'utilisateur
     * 2. Invalide la session
     * 3. Régénère le token CSRF
     * 4. Redirige vers la page d'accueil
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
