<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Track;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArtStreamController extends Controller
{
    /**
     * @return array<string, mixed>
     */
    private function formatTrackComment($comment): array
    {
        return [
            'id' => $comment->id,
            'user' => [
                'id' => $comment->user->id,
                'name' => $comment->user->name,
                'profile_photo' => $comment->user->profile_photo,
            ],
            'content' => $comment->content,
            'created_at' => $comment->created_at->diffForHumans(),
            'replies' => $comment->replies->map(fn ($reply) => [
                'id' => $reply->id,
                'user' => [
                    'id' => $reply->user->id,
                    'name' => $reply->user->name,
                    'profile_photo' => $reply->user->profile_photo,
                ],
                'content' => $reply->content,
                'created_at' => $reply->created_at->diffForHumans(),
            ]),
        ];
    }

    public function index(): Response
    {
        // Get user's favorited track IDs
        $favoritedTrackIds = auth()->check()
            ? auth()->user()->favorites()->pluck('track_id')->toArray()
            : [];

        // Fetch featured/trending albums
        $featuredAlbums = Album::whereHas('artist', function ($q) {
            $q->where('is_active', true)->whereNull('banned_at');
        })
            ->with(['artist.artistProfile', 'tracks'])
            ->where('is_streamable', true)
            ->whereNotNull('published_at')
            ->withCount('tracks')
            ->orderByDesc('total_plays')
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
                    'total_plays' => $album->total_plays,
                    'tracks_count' => $album->tracks_count,
                    'artist' => [
                        'id' => $album->artist->id,
                        'name' => $album->artist->name,
                        'stage_name' => $album->artist->artistProfile->stage_name ?? $album->artist->name,
                        'profile_photo' => $album->artist->profile_photo,
                        'level' => $album->artist->artistProfile->level?->value ?? 'Talent',
                    ],
                ];
            });

        // Fetch recent albums
        $recentAlbums = Album::whereHas('artist', function ($q) {
            $q->where('is_active', true)->whereNull('banned_at');
        })
            ->with(['artist.artistProfile'])
            ->where('is_streamable', true)
            ->whereNotNull('published_at')
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
                    'artist' => [
                        'id' => $album->artist->id,
                        'name' => $album->artist->name,
                        'stage_name' => $album->artist->artistProfile->stage_name ?? $album->artist->name,
                        'profile_photo' => $album->artist->profile_photo,
                        'level' => $album->artist->artistProfile->level?->value ?? 'Talent',
                    ],
                ];
            });

        // Fetch top tracks (most played)
        $topTracks = Track::where('is_banned', false)
            ->whereHas('album.artist', function ($q) {
                $q->where('is_active', true)->whereNull('banned_at');
            })
            ->with(['album.artist.artistProfile', 'comments.user', 'comments.replies.user'])
            ->orderByDesc('plays')
            ->limit(20)
            ->get()
            ->map(function ($track) use ($favoritedTrackIds) {
                return [
                    'id' => $track->id,
                    'title' => $track->title,
                    'duration_seconds' => $track->duration_seconds,
                    'plays' => $track->plays,
                    'file_url' => $track->file_url,
                    'is_favorited' => in_array($track->id, $favoritedTrackIds),
                    'comments' => $track->comments->map(fn ($comment) => $this->formatTrackComment($comment)),
                    'album' => [
                        'id' => $track->album->id,
                        'title' => $track->album->title,
                        'cover_url' => $track->album->cover_url,
                        'artist' => [
                            'id' => $track->album->artist->id,
                            'name' => $track->album->artist->name,
                            'stage_name' => $track->album->artist->artistProfile->stage_name ?? $track->album->artist->name,
                            'profile_photo' => $track->album->artist->profile_photo,
                            'level' => $track->album->artist->artistProfile->level?->value ?? 'Talent',
                        ],
                    ],
                ];
            });
        // Genres available
        $genres = [
            'afrobeat',
            'coupé-décalé',
            'makossa',
            'rumba',
            'highlife',
            'gospel',
            'hip-hop',
            'r&b',
            'jazz',
        ];

        return Inertia::render('ArtStream/music-hub', [
            'featuredAlbums' => $featuredAlbums,
            'recentAlbums' => $recentAlbums,
            'topTracks' => $topTracks,
            'genres' => $genres,
        ]);
    }

    public function album(Album $album): Response
    {
        $album->load(['artist.artistProfile', 'tracks.comments.user', 'tracks.comments.replies.user']);

        // Get user's favorited track IDs
        $favoritedTrackIds = auth()->check()
            ? auth()->user()->favorites()->pluck('track_id')->toArray()
            : [];

        $isPurchased = false;
        $isInLibrary = false;
        if (auth()->check()) {
            $isInLibrary = auth()->user()->favoriteAlbums()->where('album_id', $album->id)->exists();
        }

        return Inertia::render('ArtStream/album-view', [
            'album' => [
                'id' => $album->id,
                'title' => $album->title,
                'cover_url' => $album->cover_url,
                'genre' => $album->genre,
                'year' => $album->year,
                'price' => $album->price,
                'total_plays' => $album->total_plays,
                'artist' => [
                    'id' => $album->artist->id,
                    'name' => $album->artist->name,
                    'stage_name' => $album->artist->artistProfile->stage_name ?? $album->artist->name,
                    'profile_photo' => $album->artist->profile_photo,
                    'level' => $album->artist->artistProfile->level?->value ?? 'Talent',
                ],
            ],
            'tracks' => $album->tracks->map(function ($track) use ($favoritedTrackIds) {
                return [
                    'id' => $track->id,
                    'title' => $track->title,
                    'duration_seconds' => $track->duration_seconds,
                    'plays' => $track->plays,
                    'file_url' => $track->file_url,
                    'track_number' => $track->track_number,
                    'is_favorited' => in_array($track->id, $favoritedTrackIds),
                    'comments' => $track->comments->map(fn ($comment) => $this->formatTrackComment($comment)),
                ];
            }),
            'isPurchased' => $isPurchased,
            'isInLibrary' => $isInLibrary,
        ]);
    }

    public function playTrack(Track $track): \Illuminate\Http\JsonResponse
    {
        $track->incrementPlays();

        return response()->json([
            'success' => true,
            'plays' => $track->plays,
            'total_album_plays' => $track->album->total_plays,
        ]);
    }

    public function player(Request $request): Response
    {
        $trackId = $request->query('track');
        $albumId = $request->query('album');

        $initialTrack = null;
        $albumTracks = null;

        // Get user's favorited track IDs
        $favoritedTrackIds = auth()->check()
            ? auth()->user()->favorites()->pluck('track_id')->toArray()
            : [];

        if ($trackId) {
            $track = Track::available()->with(['album.artist.artistProfile', 'comments.user', 'comments.replies.user'])->find($trackId);

            if ($track) {
                $initialTrack = [
                    'id' => $track->id,
                    'title' => $track->title,
                    'duration_seconds' => $track->duration_seconds,
                    'url' => $track->file_url,
                    'album' => $track->album->title,
                    'artist' => $track->album->artist->artistProfile->stage_name ?? $track->album->artist->name,
                    'image' => $track->album->cover_url,
                    'is_favorited' => in_array($track->id, $favoritedTrackIds),
                    'comments' => $track->comments->map(fn ($comment) => $this->formatTrackComment($comment)),
                ];

                // Load all tracks from the album for queue
                $albumTracks = $track->album->tracks()
                    ->available()
                    ->with(['comments.user', 'comments.replies.user'])
                    ->orderBy('track_number')
                    ->get()
                    ->map(function ($t) use ($favoritedTrackIds) {
                        return [
                            'id' => $t->id,
                            'title' => $t->title,
                            'duration_seconds' => $t->duration_seconds,
                            'url' => $t->file_url,
                            'album' => $t->album->title,
                            'artist' => $t->album->artist->artistProfile->stage_name ?? $t->album->artist->name,
                            'image' => $t->album->cover_url,
                            'is_favorited' => in_array($t->id, $favoritedTrackIds),
                            'comments' => $t->comments->map(fn ($comment) => $this->formatTrackComment($comment)),
                        ];
                    });
            }
        } elseif ($albumId) {
            $album = Album::available()->with(['artist.artistProfile', 'tracks' => fn ($q) => $q->available()])->find($albumId);

            if ($album && $album->tracks->isNotEmpty()) {
                $firstTrack = $album->tracks->first();

                $initialTrack = [
                    'id' => $firstTrack->id,
                    'title' => $firstTrack->title,
                    'duration_seconds' => $firstTrack->duration_seconds,
                    'url' => $firstTrack->file_url,
                    'album' => $album->title,
                    'artist' => $album->artist->artistProfile->stage_name ?? $album->artist->name,
                    'image' => $album->cover_url,
                    'is_favorited' => in_array($firstTrack->id, $favoritedTrackIds),
                ];

                $albumTracks = $album->tracks->map(function ($t) use ($album, $favoritedTrackIds) {
                    return [
                        'id' => $t->id,
                        'title' => $t->title,
                        'duration_seconds' => $t->duration_seconds,
                        'url' => $t->file_url,
                        'album' => $album->title,
                        'artist' => $album->artist->artistProfile->stage_name ?? $album->artist->name,
                        'image' => $album->cover_url,
                        'is_favorited' => in_array($t->id, $favoritedTrackIds),
                    ];
                });
            }
        }

        return Inertia::render('ArtStream/full-player', [
            'initialTrack' => $initialTrack,
            'albumTracks' => $albumTracks,
        ]);
    }

    public function search(Request $request): Response
    {
        $query = $request->input('q', '');
        $type = $request->input('type', 'all'); // all, tracks, albums, artists

        $results = [
            'tracks' => [],
            'albums' => [],
            'artists' => [],
            'query' => $query,
        ];

        if (strlen($query) < 2) {
            return Inertia::render('ArtStream/search', $results);
        }

        // Get user's favorited track IDs
        $favoritedTrackIds = auth()->check()
            ? auth()->user()->favorites()->pluck('track_id')->toArray()
            : [];

        // Search Tracks
        if (in_array($type, ['all', 'tracks'])) {
            $results['tracks'] = Track::available()->with(['album.artist.artistProfile'])
                ->where(function ($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%")
                        ->orWhereHas('album', function ($q) use ($query) {
                            $q->where('title', 'like', "%{$query}%");
                        })
                        ->orWhereHas('album.artist', function ($q) use ($query) {
                            $q->where('name', 'like', "%{$query}%");
                        })
                        ->orWhereHas('album.artist.artistProfile', function ($q) use ($query) {
                            $q->where('stage_name', 'like', "%{$query}%");
                        });
                })
                ->limit(20)
                ->get()
                ->map(function ($track) use ($favoritedTrackIds) {
                    return [
                        'id' => $track->id,
                        'title' => $track->title,
                        'duration_seconds' => $track->duration_seconds,
                        'plays' => $track->plays,
                        'file_url' => $track->file_url,
                        'is_favorited' => in_array($track->id, $favoritedTrackIds),
                        'album' => [
                            'id' => $track->album->id,
                            'title' => $track->album->title,
                            'cover_url' => $track->album->cover_url,
                            'artist' => [
                                'id' => $track->album->artist->id,
                                'stage_name' => $track->album->artist->artistProfile->stage_name ?? $track->album->artist->name,
                            ],
                        ],
                    ];
                });
        }

        // Search Albums
        if (in_array($type, ['all', 'albums'])) {
            $results['albums'] = Album::available()->with(['artist.artistProfile'])
                ->where('is_streamable', true)
                ->where(function ($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%")
                        ->orWhere('genre', 'like', "%{$query}%");
                })
                ->withCount('tracks')
                ->limit(12)
                ->get()
                ->map(function ($album) {
                    return [
                        'id' => $album->id,
                        'title' => $album->title,
                        'cover_url' => $album->cover_url,
                        'genre' => $album->genre,
                        'year' => $album->year,
                        'total_plays' => $album->total_plays,
                        'tracks_count' => $album->tracks_count,
                        'artist' => [
                            'id' => $album->artist->id,
                            'stage_name' => $album->artist->artistProfile->stage_name ?? $album->artist->name,
                        ],
                    ];
                });
        }

        // Search Artists
        if (in_array($type, ['all', 'artists'])) {
            $results['artists'] = \App\Models\User::active()->where('role', 'artist')
                ->with(['artistProfile'])
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                        ->orWhereHas('artistProfile', function ($profileQ) use ($query) {
                            $profileQ->where('stage_name', 'like', "%{$query}%")
                                ->orWhere('bio', 'like', "%{$query}%");
                        });
                })
                ->withCount('albums')
                ->limit(12)
                ->get()
                ->map(function ($artist) {
                    return [
                        'id' => $artist->id,
                        'name' => $artist->name,
                        'stage_name' => $artist->artistProfile->stage_name ?? $artist->name,
                        'profile_photo' => $artist->profile_photo,
                        'bio' => $artist->artistProfile->bio ?? null,
                        'albums_count' => $artist->albums_count,
                    ];
                });
        }

        return Inertia::render('ArtStream/search', $results);
    }
}
