<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\CarouselSlide;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        // Fetch featured/trending artists (verified with profiles)
        $featuredArtists = User::where('is_active', true)
            ->whereHas('artistProfile', function ($query) {
                $query->where('is_verified', true)
                    ->where('verification_status', 'approved');
            })
            ->with(['artistProfile'])
            ->withCount('services')
            ->limit(10)
            ->get()
            ->map(function ($user) {
                $categories = is_array($user->artistProfile->categories)
                    ? $user->artistProfile->categories
                    : json_decode($user->artistProfile->categories ?? '[]');

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'stage_name' => $user->artistProfile->stage_name,
                    'city' => $user->city,
                    'profile_photo' => $user->profile_photo,
                    'categories' => $categories,
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

        $carouselSlides = $this->getCarouselSlides('main');
        $heroSlides = $this->getCarouselSlides('hero');

        $heroSettings = \App\Models\HeroSetting::first() ?? \App\Models\HeroSetting::create([
            'type' => 'image',
            'title' => 'Découvrez les talents de Côte d\'Ivoire',
            'subtitle' => 'Réservez vos artistes préférés pour vos événements.',
            'image_url' => 'https://images.unsplash.com/photo-1514525253440-b393452eeb25?q=80&w=1600&auto=format&fit=crop',
            'link_url' => '/artists',
            'link_label' => 'Explorer les artistes',
            'is_active' => true,
        ]);

        return Inertia::render('home', [
            'featuredArtists' => $featuredArtists,
            'recentAlbums' => $recentAlbums,
            'categories' => $categories,
            'carouselSlides' => $carouselSlides,
            'heroSlides' => $heroSlides,
            'heroSettings' => $heroSettings,
        ]);
    }

    protected function getCarouselSlides(string $type = 'main'): Collection
    {
        if (! Schema::hasTable('carousel_slides')) {
            return collect();
        }

        return CarouselSlide::with(['artist.artistProfile'])
            ->where('is_active', true)
            ->where('type', $type)
            ->orderBy('order')
            ->get()
            ->map(function ($slide) {
                if ($slide->artist_id && $slide->artist) {
                    return [
                        'id' => $slide->id,
                        'title' => $slide->title ?: $slide->artist->artistProfile->stage_name,
                        'subtitle' => $slide->subtitle ?: $slide->artist->city,
                        'image_url' => $slide->image_url ?: $slide->artist->profile_photo,
                        'link_url' => $slide->link_url ?: route('artist.show', $slide->artist_id),
                        'link_label' => $slide->link_label ?: 'Voir le profil',
                        'artist' => $slide->artist,
                    ];
                }

                return [
                    'id' => $slide->id,
                    'title' => $slide->title,
                    'subtitle' => $slide->subtitle,
                    'image_url' => $slide->image_url,
                    'link_url' => $slide->link_url,
                    'link_label' => $slide->link_label,
                ];
            });
    }
}
