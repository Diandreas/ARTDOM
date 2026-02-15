<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        // Fetch featured/trending artists (verified with profiles)
        $featuredArtists = User::whereHas('artistProfile', function ($query) {
            $query->where('is_verified', true);
        })
            ->with(['artistProfile'])
            ->withCount('services')
            ->limit(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'stage_name' => $user->artistProfile->stage_name,
                    'city' => $user->city,
                    'profile_photo' => $user->profile_photo,
                    'categories' => json_decode($user->artistProfile->categories),
                    'rating' => $user->artistProfile->rating,
                    'total_reviews' => $user->artistProfile->total_reviews,
                    'services_count' => $user->services_count,
                    'is_verified' => $user->artistProfile->is_verified,
                ];
            });

        // Fetch recent albums
        $recentAlbums = Album::with(['artist.artistProfile'])
            ->latest('published_at')
            ->limit(12)
            ->get()
            ->map(function ($album) {
                return [
                    'id' => $album->id,
                    'title' => $album->title,
                    'cover_url' => $album->cover_url,
                    'genre' => $album->genre,
                    'year' => $album->year,
                    'price' => $album->price,
                    'artist' => [
                        'id' => $album->artist->id,
                        'name' => $album->artist->name,
                        'stage_name' => $album->artist->artistProfile->stage_name ?? $album->artist->name,
                    ],
                ];
            });

        // Categories for quick navigation
        $categories = [
            ['key' => 'singer', 'label' => 'Chanteurs', 'icon' => 'mic'],
            ['key' => 'dj', 'label' => 'DJs', 'icon' => 'disc'],
            ['key' => 'dancer', 'label' => 'Danseurs', 'icon' => 'dance'],
            ['key' => 'musician', 'label' => 'Musiciens', 'icon' => 'guitar'],
            ['key' => 'painter', 'label' => 'Peintres', 'icon' => 'palette'],
            ['key' => 'photographer', 'label' => 'Photographes', 'icon' => 'camera'],
        ];

        return Inertia::render('home', [
            'featuredArtists' => $featuredArtists,
            'recentAlbums' => $recentAlbums,
            'categories' => $categories,
        ]);
    }
}
