<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PreferencesController extends Controller
{
    /**
     * Affiche la page des préférences
     * 
     * Route: GET /settings
     * Middleware: auth
     * 
     * Affiche les préférences de l'utilisateur :
     * - Thème (clair/sombre)
     * - Langue
     * - Préférences de notifications
     */
    public function show(): Response
    {
        $user = Auth::user();

        // Récupérer les préférences depuis la base de données ou config par défaut
        $preferences = [
            'theme' => $user->preferences['theme'] ?? 'light',
            'language' => $user->preferences['language'] ?? 'fr',
            'notifications' => [
                'email' => $user->preferences['notifications']['email'] ?? true,
                'push' => $user->preferences['notifications']['push'] ?? true,
                'reservations' => $user->preferences['notifications']['reservations'] ?? true,
                'messages' => $user->preferences['notifications']['messages'] ?? true,
                'reviews' => $user->preferences['notifications']['reviews'] ?? true,
            ],
        ];

        return Inertia::render('Settings/App', [
            'preferences' => $preferences,
        ]);
    }

    /**
     * Met à jour les préférences
     * 
     * Route: PUT /settings
     * Middleware: auth
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'theme' => ['nullable', 'in:light,dark'],
            'language' => ['nullable', 'in:fr,en'],
            'notifications' => ['nullable', 'array'],
            'notifications.email' => ['nullable', 'boolean'],
            'notifications.push' => ['nullable', 'boolean'],
            'notifications.reservations' => ['nullable', 'boolean'],
            'notifications.messages' => ['nullable', 'boolean'],
            'notifications.reviews' => ['nullable', 'boolean'],
        ]);

        $user = Auth::user();

        // Récupérer les préférences existantes
        $preferences = $user->preferences ?? [];

        // Mettre à jour avec les nouvelles valeurs
        if (isset($validated['theme'])) {
            $preferences['theme'] = $validated['theme'];
        }
        if (isset($validated['language'])) {
            $preferences['language'] = $validated['language'];
        }
        if (isset($validated['notifications'])) {
            $preferences['notifications'] = array_merge(
                $preferences['notifications'] ?? [],
                $validated['notifications']
            );
        }

        // Sauvegarder (nécessite un champ JSON dans la table users)
        // TODO: Ajouter un champ preferences JSON dans la migration users
        // $user->update(['preferences' => $preferences]);

        return back()->with('message', 'Préférences mises à jour.');
    }
}
