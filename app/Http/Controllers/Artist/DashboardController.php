<?php

namespace App\Http\Controllers\Artist;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $artist = Auth::user();

        // Services de l'artiste
        $services = Service::where('artist_id', $artist->id)
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'title' => $service->title,
                    'price' => $service->price,
                    'is_active' => $service->is_active,
                    'category' => $service->category,
                ];
            });

        // Albums de l'artiste avec stats
        $albums = Album::where('artist_id', $artist->id)
            ->withCount('tracks')
            ->get()
            ->map(function ($album) {
                return [
                    'id' => $album->id,
                    'title' => $album->title,
                    'cover_url' => $album->cover_url,
                    'total_plays' => $album->total_plays,
                    'tracks_count' => $album->tracks_count,
                    'year' => $album->year,
                ];
            });

        // Calcul du total des écoutes
        $totalPlays = Album::where('artist_id', $artist->id)->sum('total_plays');

        // Statistiques basiques
        $stats = [
            'services_count' => $services->count(),
            'active_services' => $services->where('is_active', true)->count(),
            'albums_count' => $albums->count(),
            'total_plays' => $totalPlays,
            'avg_album_plays' => $albums->count() > 0 ? round($totalPlays / $albums->count()) : 0,
        ];

        // Album le plus populaire
        $topAlbum = $albums->sortByDesc('total_plays')->first();

        return Inertia::render('Artist/dashboard', [
            'stats' => $stats,
            'services' => $services,
            'albums' => $albums->take(6),
            'topAlbum' => $topAlbum,
            'artistProfile' => [
                'stage_name' => $artist->artistProfile->stage_name ?? $artist->name,
                'bio' => $artist->artistProfile->bio ?? '',
                'categories' => json_decode($artist->artistProfile->categories ?? '[]'),
                'base_rate' => $artist->artistProfile->base_rate ?? 0,
                'is_verified' => $artist->artistProfile->is_verified ?? false,
                'rating' => $artist->artistProfile->rating ?? 0,
                'total_reviews' => $artist->artistProfile->total_reviews ?? 0,
            ],
        ]);
    }
}
