<?php

namespace App\Http\Controllers\Stream;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\AlbumPurchase;
use App\Models\Playlist;
use App\Models\Track;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AlbumController extends Controller
{
    /**
     * Affiche le hub de streaming musical
     * 
     * Route: GET /stream
     * Middleware: auth
     * 
     * Affiche :
     * - Derniers albums publiés
     * - Top artistes
     * - Genres disponibles
     * - Playlists recommandées
     * - Recommandations personnalisées
     */
    public function index(): Response
    {
        $client = Auth::user();

        // Derniers albums publiés
        $latestAlbums = Album::whereNotNull('published_at')
            ->where('is_streamable', true)
            ->with('artist.artistProfile')
            ->orderBy('published_at', 'desc')
            ->limit(20)
            ->get();

        // Top artistes (par nombre d'écoutes)
        $topArtists = User::where('role', 'artist')
            ->whereHas('artistProfile', function ($query) {
                $query->where('verification_status', 'approved');
            })
            ->with(['artistProfile', 'albums' => function ($query) {
                $query->whereNotNull('published_at')
                    ->orderBy('total_plays', 'desc')
                    ->limit(1);
            }])
            ->get()
            ->sortByDesc(function ($artist) {
                return $artist->albums->sum('total_plays');
            })
            ->take(10)
            ->values();

        // Genres disponibles
        $genres = Album::whereNotNull('published_at')
            ->select('genre')
            ->distinct()
            ->pluck('genre')
            ->filter()
            ->values();

        // Playlists recommandées (playlists publiques populaires)
        $playlists = Playlist::where('is_public', true)
            ->with('client.clientProfile')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Recommandations personnalisées (basées sur l'historique d'écoute)
        $recommendations = $this->getRecommendations($client);

        return Inertia::render('Stream/Hub', [
            'latestAlbums' => $latestAlbums,
            'topArtists' => $topArtists,
            'genres' => $genres,
            'playlists' => $playlists,
            'recommendations' => $recommendations,
        ]);
    }

    /**
     * Affiche les détails d'un album
     * 
     * Route: GET /stream/albums/{album}
     * Middleware: auth
     * 
     * Affiche :
     * - Informations de l'album
     * - Liste des pistes
     * - Vérifie si l'album est acheté (pour téléchargement)
     */
    public function show(Album $album): Response
    {
        $client = Auth::user();

        $album->load([
            'artist.artistProfile',
            'tracks' => function ($query) {
                $query->orderBy('track_number');
            },
        ]);

        // Vérifier si l'album est acheté
        $isPurchased = $album->isPurchasedBy($client->id);

        return Inertia::render('Stream/Album', [
            'album' => $album,
            'isPurchased' => $isPurchased,
        ]);
    }

    /**
     * Achète un album
     * 
     * Route: POST /stream/albums/{album}/purchase
     * Middleware: auth, role:client
     * 
     * Crée un achat d'album et initie le paiement
     */
    public function purchase(Request $request, Album $album): RedirectResponse
    {
        if (!$album->is_purchasable || $album->price <= 0) {
            return back()->withErrors(['message' => 'Cet album n\'est pas disponible à l\'achat.']);
        }

        $client = Auth::user();

        // Vérifier si déjà acheté
        if ($album->isPurchasedBy($client->id)) {
            return back()->withErrors(['message' => 'Vous avez déjà acheté cet album.']);
        }

        // Créer le paiement
        $payment = \App\Models\Payment::create([
            'client_id' => $client->id,
            'amount' => $album->price,
            'currency' => 'XAF',
            'method' => 'pending',
            'status' => \App\Enums\PaymentStatus::Pending,
        ]);

        // Créer l'achat (sera confirmé après paiement)
        AlbumPurchase::create([
            'client_id' => $client->id,
            'album_id' => $album->id,
            'payment_id' => $payment->id,
            'price_paid' => $album->price,
        ]);

        // Rediriger vers le paiement
        return redirect()->route('payment.show', ['reservation' => null, 'album' => $album->id])
            ->with('message', 'Veuillez procéder au paiement pour finaliser l\'achat.');
    }

    /**
     * Génère une URL signée pour jouer une piste
     * 
     * Route: GET /stream/albums/{album}/tracks/{track}/play
     * Middleware: auth
     * 
     * Logique:
     * 1. Vérifie que l'album est streamable ou acheté
     * 2. Génère une URL signée temporaire pour le fichier audio
     * 3. Incrémente le compteur de lectures
     */
    public function play(Album $album, Track $track): \Illuminate\Http\JsonResponse
    {
        $client = Auth::user();

        // Vérifier que la piste appartient à l'album
        if ($track->album_id !== $album->id) {
            abort(404);
        }

        // Vérifier l'accès (streamable ou acheté)
        if (!$album->is_streamable && !$album->isPurchasedBy($client->id)) {
            abort(403, 'Vous devez acheter cet album pour y accéder.');
        }

        // Générer une URL signée (valide 1 heure)
        $signedUrl = Storage::disk('public')->temporaryUrl(
            str_replace('/storage/', '', $track->file_url),
            now()->addHour()
        );

        // Incrémenter les lectures
        $track->incrementPlays();

        return response()->json([
            'signed_url' => $signedUrl,
            'track' => $track->only(['id', 'title', 'duration_seconds']),
        ]);
    }

    /**
     * Génère des recommandations personnalisées
     */
    private function getRecommendations($client): \Illuminate\Support\Collection
    {
        // TODO: Implémenter un algorithme de recommandation basé sur l'historique
        // Pour l'instant, retourner des albums populaires
        return Album::whereNotNull('published_at')
            ->where('is_streamable', true)
            ->with('artist.artistProfile')
            ->orderBy('total_plays', 'desc')
            ->limit(10)
            ->get();
    }
}
