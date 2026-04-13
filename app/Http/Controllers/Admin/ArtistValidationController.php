<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArtistProfile;
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
     */
    public function index(): Response
    {
        $pendingArtists = User::where('role', 'artist')
            ->whereHas('artistProfile', function ($query) {
                $query->where('verification_status', 'pending');
            })
            ->with(['artistProfile'])
            ->latest()
            ->get()
            ->map(function ($artist) {
                $fullName = trim(($artist->clientProfile->first_name ?? '').' '.($artist->clientProfile->last_name ?? ''));
                $categories = is_array($artist->artistProfile?->categories) 
                    ? $artist->artistProfile->categories 
                    : json_decode($artist->artistProfile?->categories ?? '[]');

                return [
                    'id' => $artist->id,
                    'name' => $artist->name,
                    'stage_name' => $artist->artistProfile?->stage_name,
                    'category' => $categories[0] ?? 'Non renseignee',
                    'city' => $artist->city,
                    'verification_status' => $artist->artistProfile?->verification_status,
                    'full_name' => $fullName !== '' ? $fullName : 'Non renseigne',
                    'email' => $artist->email,
                    'phone' => $artist->phone,
                    'registered_at' => $artist->created_at?->toIso8601String(),
                    'base_rate' => (float) ($artist->artistProfile?->base_rate ?? 0),
                    'bio' => $artist->artistProfile?->bio,
                    'portfolio_urls' => $artist->artistProfile?->portfolio_urls ?? [],
                ];
            });

        return Inertia::render('Admin/ArtistValidation', [
            'artists' => $pendingArtists,
            'rejectionReasons' => [
                ['value' => 'incomplete_information', 'label' => 'Informations incompletes'],
                ['value' => 'portfolio_quality', 'label' => 'Qualite portfolio insuffisante'],
                ['value' => 'non_compliant_documents', 'label' => 'Documents non conformes'],
                ['value' => 'duplicate_account', 'label' => 'Compte en doublon'],
            ],
        ]);
    }

    /**
     * Approuve un artiste
     *
     * Route: POST /admin/artists/{id}/approve
     */
    public function approve(string $id): RedirectResponse
    {
        $artist = User::findOrFail($id);

        if ($artist->artistProfile) {
            $artist->artistProfile->update([
                'verification_status' => 'approved',
                'is_verified' => true,
            ]);
        }

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'L\'artiste '.$artist->name.' a ete approuve avec succes.',
        ]);
    }

    /**
     * Rejette la demande d'un artiste
     *
     * Route: POST /admin/artists/{id}/reject
     */
    public function reject(Request $request, string $id): RedirectResponse
    {
        $request->validate([
            'reason' => 'required|string',
            'custom_reason' => 'required_if:reason,other|nullable|string|max:500',
        ]);

        $artist = User::findOrFail($id);
        $reason = $request->reason === 'other' ? $request->custom_reason : $request->reason;

        if ($artist->artistProfile) {
            $artist->artistProfile->update([
                'verification_status' => 'rejected',
                'is_verified' => false,
                // On pourrait stocker la raison du rejet quelque part si besoin
            ]);
        }

        return redirect()->back()->with('toast', [
            'type' => 'info',
            'message' => 'La demande de '.$artist->name.' a ete rejetee.',
        ]);
    }
}
