<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArtistController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::whereHas('artistProfile')
            ->with(['artistProfile']);

        // Filtre par catégorie
        if ($request->filled('category')) {
            $query->whereHas('artistProfile', function ($q) use ($request) {
                $q->whereRaw("json_extract(categories, '$[0]') = ?", [$request->category])
                    ->orWhereRaw("json_extract(categories, '$[1]') = ?", [$request->category])
                    ->orWhereRaw("json_extract(categories, '$[2]') = ?", [$request->category]);
            });
        }

        // Filtre par ville
        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }

        // Filtre par tarif max
        if ($request->filled('max_rate')) {
            $query->whereHas('artistProfile', function ($q) use ($request) {
                $q->where('base_rate', '<=', $request->max_rate);
            });
        }

        // Filtre vérifiés uniquement
        if ($request->boolean('verified')) {
            $query->whereHas('artistProfile', function ($q) {
                $q->where('is_verified', true);
            });
        }

        // Recherche par nom
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('artistProfile', function ($q) use ($search) {
                        $q->where('stage_name', 'like', "%{$search}%");
                    });
            });
        }

        // Tri
        $sortBy = $request->input('sort', 'rating');
        if ($sortBy === 'rating') {
            $query->join('artist_profiles', 'users.id', '=', 'artist_profiles.user_id')
                ->orderByDesc('artist_profiles.rating');
        } elseif ($sortBy === 'rate_asc') {
            $query->join('artist_profiles', 'users.id', '=', 'artist_profiles.user_id')
                ->orderBy('artist_profiles.base_rate');
        } elseif ($sortBy === 'rate_desc') {
            $query->join('artist_profiles', 'users.id', '=', 'artist_profiles.user_id')
                ->orderByDesc('artist_profiles.base_rate');
        }

        $artists = $query->select('users.*')
            ->paginate(12)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'city' => $user->city,
                    'profile_photo' => $user->profile_photo,
                    'stage_name' => $user->artistProfile->stage_name ?? $user->name,
                    'categories' => json_decode($user->artistProfile->categories ?? '[]'),
                    'base_rate' => $user->artistProfile->base_rate ?? 0,
                    'is_verified' => $user->artistProfile->is_verified ?? false,
                    'rating' => $user->artistProfile->rating ?? 0,
                    'total_reviews' => $user->artistProfile->total_reviews ?? 0,
                ];
            });

        // Liste des villes disponibles
        $cities = User::whereHas('artistProfile')
            ->distinct()
            ->pluck('city')
            ->filter()
            ->sort()
            ->values();

        // Catégories disponibles
        $categories = [
            ['key' => 'singer', 'label' => 'Chanteurs'],
            ['key' => 'dj', 'label' => 'DJs'],
            ['key' => 'dancer', 'label' => 'Danseurs'],
            ['key' => 'musician', 'label' => 'Musiciens'],
            ['key' => 'painter', 'label' => 'Peintres'],
            ['key' => 'photographer', 'label' => 'Photographes'],
        ];

        return Inertia::render('artists', [
            'artists' => $artists,
            'cities' => $cities,
            'categories' => $categories,
            'filters' => [
                'category' => $request->input('category'),
                'city' => $request->input('city'),
                'max_rate' => $request->input('max_rate'),
                'verified' => $request->boolean('verified'),
                'search' => $request->input('search'),
                'sort' => $request->input('sort', 'rating'),
            ],
        ]);
    }

    public function show(string $id): Response
    {
        $artist = User::with(['artistProfile'])
            ->findOrFail($id);

        // Services de l'artiste
        $services = Service::where('artist_id', $artist->id)
            ->where('is_active', true)
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'title' => $service->title,
                    'description' => $service->description,
                    'price' => $service->price,
                    'price_type' => $service->price_type,
                    'duration_minutes' => $service->duration_minutes,
                    'category' => $service->category,
                    'location_type' => $service->location_type,
                ];
            });

        // Albums de l'artiste
        $albums = Album::where('artist_id', $artist->id)
            ->where('is_streamable', true)
            ->withCount('tracks')
            ->orderByDesc('published_at')
            ->limit(6)
            ->get()
            ->map(function ($album) {
                return [
                    'id' => $album->id,
                    'title' => $album->title,
                    'cover_url' => $album->cover_url,
                    'year' => $album->year,
                    'genre' => $album->genre,
                    'total_plays' => $album->total_plays,
                    'tracks_count' => $album->tracks_count,
                    'price' => $album->price,
                ];
            });

        // Stats de l'artiste
        $stats = [
            'total_services' => $services->count(),
            'total_albums' => Album::where('artist_id', $artist->id)->count(),
            'total_plays' => Album::where('artist_id', $artist->id)->sum('total_plays'),
        ];

        return Inertia::render('Artist/profile', [
            'artist' => [
                'id' => $artist->id,
                'name' => $artist->name,
                'email' => $artist->email,
                'city' => $artist->city,
                'profile_photo' => $artist->profile_photo,
                'stage_name' => $artist->artistProfile->stage_name ?? $artist->name,
                'bio' => $artist->artistProfile->bio ?? '',
                'categories' => json_decode($artist->artistProfile->categories ?? '[]'),
                'base_rate' => $artist->artistProfile->base_rate ?? 0,
                'is_verified' => $artist->artistProfile->is_verified ?? false,
                'rating' => $artist->artistProfile->rating ?? 0,
                'total_reviews' => $artist->artistProfile->total_reviews ?? 0,
                'portfolio_urls' => json_decode($artist->artistProfile->portfolio_urls ?? '[]'),
                'social_links' => json_decode($artist->artistProfile->social_links ?? '{}'),
            ],
            'services' => $services,
            'albums' => $albums,
            'stats' => $stats,
        ]);
    }
}
