<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Track;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        // Réservations récentes
        $reservations = $user->reservations()
            ->with(['artist.artistProfile', 'service'])
            ->latest()
            ->limit(5)
            ->get();

        // Statistiques
        $stats = [
            'reservations_count' => $user->reservations()->count(),
            'favorites_count' => 0,
            'total_spent' => $user->reservations()->where('status', 'completed')->sum('total_amount'),
        ];

        // Musiques tendance : pistes avec le plus de plays (min 1 play)
        // Si aucune n'a de plays, on prend une sélection aléatoire
        $trendingTracks = Track::query()
            ->with(['album.artist'])
            ->where('plays', '>', 0)
            ->orderByDesc('plays')
            ->limit(15)
            ->get();

        if ($trendingTracks->isEmpty()) {
            $trendingTracks = Track::query()
                ->with(['album.artist'])
                ->inRandomOrder()
                ->limit(15)
                ->get();
        }

        $trendingTracks = $trendingTracks->map(fn (Track $track) => [
            'id' => $track->id,
            'title' => $track->title,
            'artist' => $track->album->artist->name ?? 'Artiste inconnu',
            'image' => $track->album->cover_url ?? '/images/default-cover.jpg',
            'url' => $track->file_url,
            'album' => $track->album->title,
            'plays' => $track->plays,
            'is_favorited' => false,
        ]);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentReservations' => $reservations,
            'trendingTracks' => $trendingTracks,
            'isTrending' => Track::where('plays', '>', 0)->exists(),
        ]);
    }
}
