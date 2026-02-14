<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArtistValidationController extends Controller
{
    /**
     * Affiche la liste des artistes en attente de validation
     * 
     * Route: GET /admin/artists/pending
     * Middleware: auth, role:admin
     */
    public function index(): Response
    {
        $pendingArtists = User::where('role', 'artist')
            ->whereHas('artistProfile', function ($query) {
                $query->where('verification_status', 'pending');
            })
            ->with('artistProfile')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/ArtistValidation', [
            'artists' => $pendingArtists,
        ]);
    }

    /**
     * Approuve un artiste
     * 
     * Route: POST /admin/artists/{artist}/approve
     * Middleware: auth, role:admin
     * 
     * Logique:
     * 1. Met à jour le statut de vérification
     * 2. Active le compte artiste
     * 3. Notifie l'artiste
     */
    public function approve(Request $request, User $artist): RedirectResponse
    {
        if ($artist->role !== 'artist' || !$artist->artistProfile) {
            abort(404);
        }

        $artist->artistProfile->update([
            'verification_status' => 'approved',
            'is_verified' => true,
        ]);

        $artist->update(['is_active' => true]);

        // TODO: Envoyer une notification à l'artiste

        return back()->with('message', 'Artiste approuvé avec succès.');
    }

    /**
     * Rejette un artiste
     * 
     * Route: POST /admin/artists/{artist}/reject
     * Middleware: auth, role:admin
     * 
     * Logique:
     * 1. Met à jour le statut de vérification
     * 2. Désactive le compte artiste
     * 3. Notifie l'artiste avec la raison
     */
    public function reject(Request $request, User $artist): RedirectResponse
    {
        if ($artist->role !== 'artist' || !$artist->artistProfile) {
            abort(404);
        }

        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $artist->artistProfile->update([
            'verification_status' => 'rejected',
            'is_verified' => false,
        ]);

        $artist->update(['is_active' => false]);

        // TODO: Envoyer une notification à l'artiste avec la raison

        return back()->with('message', 'Artiste rejeté. Une notification a été envoyée.');
    }
}
