<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ApproveArtistValidationRequest;
use App\Http\Requests\Admin\RejectArtistValidationRequest;
use App\Models\User;
use App\Notifications\ArtistValidationApprovedNotification;
use App\Notifications\ArtistValidationRejectedNotification;
use Illuminate\Http\RedirectResponse;
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
            ->with(['artistProfile', 'clientProfile'])
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function (User $artist): array {
                $fullName = trim((string) (($artist->clientProfile?->first_name ?? '').' '.($artist->clientProfile?->last_name ?? '')));
                $categories = is_array($artist->artistProfile?->categories) ? $artist->artistProfile?->categories : [];
                $portfolioUrls = is_array($artist->artistProfile?->portfolio_urls) ? $artist->artistProfile?->portfolio_urls : [];

                return [
                    'id' => $artist->id,
                    'avatar' => $artist->profile_photo,
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
                    'portfolio_urls' => $portfolioUrls,
                    'id_document_front' => $artist->artistProfile?->id_document_front,
                    'id_document_back' => $artist->artistProfile?->id_document_back,
                ];
            });

        return Inertia::render('Admin/ArtistValidation', [
            'artists' => $pendingArtists,
            'rejectionReasons' => [
                ['value' => 'incomplete_information', 'label' => 'Informations incompletes'],
                ['value' => 'portfolio_quality', 'label' => 'Qualite portfolio insuffisante'],
                ['value' => 'non_compliant_documents', 'label' => 'Documents non conformes'],
                ['value' => 'duplicate_account', 'label' => 'Compte en doublon'],
                ['value' => 'other', 'label' => 'Autre'],
            ],
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
    public function approve(ApproveArtistValidationRequest $request, User $artist): RedirectResponse
    {
        if (! $artist->isArtist() || ! $artist->artistProfile) {
            abort(404);
        }

        $artist->artistProfile->update([
            'verification_status' => 'approved',
            'is_verified' => true,
        ]);

        $artist->update(['is_active' => true]);

        $artist->notify(new ArtistValidationApprovedNotification);

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
    public function reject(RejectArtistValidationRequest $request, User $artist): RedirectResponse
    {
        if (! $artist->isArtist() || ! $artist->artistProfile) {
            abort(404);
        }

        $validated = $request->validated();
        $reasons = [
            'incomplete_information' => 'Informations incompletes',
            'portfolio_quality' => 'Qualite portfolio insuffisante',
            'non_compliant_documents' => 'Documents non conformes',
            'duplicate_account' => 'Compte en doublon',
            'other' => 'Autre',
        ];
        $reasonLabel = $reasons[$validated['reason']] ?? 'Autre';

        $artist->artistProfile->update([
            'verification_status' => 'rejected',
            'is_verified' => false,
        ]);

        $artist->update(['is_active' => false]);

        $artist->notify(new ArtistValidationRejectedNotification(
            reasonLabel: $reasonLabel,
            customMessage: $validated['custom_message'] ?? null,
            allowResubmission: (bool) ($validated['allow_resubmission'] ?? false),
        ));

        return back()->with('message', 'Artiste rejeté. Une notification a été envoyée.');
    }
}
