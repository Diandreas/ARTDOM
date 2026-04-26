<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ArtistController extends Controller
{
    public function index(Request $request): Response
    {
        $sortBy = $request->input('sort', 'rating');

        $query = User::where('users.is_active', true)
            ->join('artist_profiles', 'users.id', '=', 'artist_profiles.user_id')
            ->where('artist_profiles.is_verified', true)
            ->with(['artistProfile']);

        // Filtre par catégorie
        if ($request->filled('category')) {
            $category = $request->input('category');
            $query->where('artist_profiles.categories', 'LIKE', "%{$category}%");
        }

        // Filtre par ville
        if ($request->filled('city')) {
            $query->where('users.city', $request->city);
        }

        // Filtre par tarif max
        if ($request->filled('max_rate')) {
            $query->where('artist_profiles.base_rate', '<=', $request->max_rate);
        }

        // Filtre vérifiés uniquement
        if ($request->boolean('verified')) {
            $query->where('artist_profiles.is_verified', true);
        }

        // Recherche par nom
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                    ->orWhere('artist_profiles.stage_name', 'like', "%{$search}%");
            });
        }

        // Tri
        if ($sortBy === 'rate_asc') {
            $query->orderBy('artist_profiles.base_rate');
        } elseif ($sortBy === 'rate_desc') {
            $query->orderByDesc('artist_profiles.base_rate');
        } else {
            $query->orderByDesc('artist_profiles.rating');
        }

        $artists = $query->select('users.*')
            ->paginate(12)
            ->withQueryString()
            ->through(function ($user) {
                $categories = $user->artistProfile->categories;
                if (is_string($categories)) {
                    $categories = json_decode($categories, true) ?? [];
                }

                $portfolioUrls = $user->artistProfile->portfolio_urls;
                if (is_string($portfolioUrls)) {
                    $portfolioUrls = json_decode($portfolioUrls, true) ?? [];
                }

                $socialLinks = $user->artistProfile->social_links;
                if (is_string($socialLinks)) {
                    $socialLinks = json_decode($socialLinks, true) ?? [];
                }

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'city' => $user->city,
                    'profile_photo' => $user->profile_photo,
                    'stage_name' => $user->artistProfile->stage_name ?? $user->name,
                    'categories' => is_array($categories) ? $categories : [],
                    'base_rate' => $user->artistProfile->base_rate ?? 0,
                    'is_verified' => $user->artistProfile->is_verified ?? false,
                    'level' => $user->artistProfile->level?->value ?? 'talent',
                    'rating' => $user->artistProfile->rating ?? 0,
                    'total_reviews' => $user->artistProfile->total_reviews ?? 0,
                    'portfolio_urls' => is_array($portfolioUrls) ? $portfolioUrls : [],
                    'social_links' => is_array($socialLinks) ? $socialLinks : [],
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
            ['key' => 'comedian', 'label' => 'Humouristes'],
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

        $isPubliclyVisible = $artist->is_active
            && $artist->artistProfile?->is_verified;
        $isAdmin = Auth::user()?->isAdmin() ?? false;

        if (! $isPubliclyVisible && ! $isAdmin) {
            abort(404);
        }

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

        $categories = $artist->artistProfile->categories;
        if (is_string($categories)) {
            $categories = json_decode($categories, true) ?? [];
        }

        $portfolioUrls = $artist->artistProfile->portfolio_urls;
        if (is_string($portfolioUrls)) {
            $portfolioUrls = json_decode($portfolioUrls, true) ?? [];
        }

        $socialLinks = $artist->artistProfile->social_links;
        if (is_string($socialLinks)) {
            $socialLinks = json_decode($socialLinks, true) ?? [];
        }

        return Inertia::render('Artist/profile', [
            'artist' => [
                'id' => $artist->id,
                'name' => $artist->name,
                'email' => $artist->email,
                'city' => $artist->city,
                'profile_photo' => $artist->profile_photo,
                'stage_name' => $artist->artistProfile->stage_name ?? $artist->name,
                'bio' => $artist->artistProfile->bio ?? '',
                'categories' => is_array($categories) ? $categories : [],
                'base_rate' => $artist->artistProfile->base_rate ?? 0,
                'is_verified' => $artist->artistProfile->is_verified ?? false,
                'level' => $artist->artistProfile->level?->value ?? 'talent',
                'rating' => $artist->artistProfile->rating ?? 0,
                'total_reviews' => $artist->artistProfile->total_reviews ?? 0,
                'portfolio_urls' => is_array($portfolioUrls) ? $portfolioUrls : [],
                'social_links' => is_array($socialLinks) ? $socialLinks : [],
            ],
            'services' => $services,
            'albums' => $albums,
            'stats' => $stats,
            'can_report' => Auth::check() && Auth::user()->isClient(),
        ]);
    }
}
