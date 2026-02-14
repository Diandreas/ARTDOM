<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\AlbumPurchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LibraryController extends Controller
{
    /**
     * Affiche la bibliothèque du client
     * 
     * Route: GET /library
     * Middleware: auth, role:client
     * 
     * Affiche :
     * - Albums achetés
     * - Playlists créées
     * - Téléchargements
     */
    public function index(): Response
    {
        $client = Auth::user();

        $albums = AlbumPurchase::where('client_id', $client->id)
            ->with('album.artist.artistProfile')
            ->latest()
            ->get()
            ->pluck('album');

        $playlists = $client->clientProfile->playlists()
            ->with('tracks.album.artist')
            ->latest()
            ->get();

        return Inertia::render('Client/Library', [
            'albums' => $albums,
            'playlists' => $playlists,
        ]);
    }

    /**
     * Retourne uniquement les albums achetés
     * 
     * Route: GET /library/albums
     */
    public function albums(): Response
    {
        $client = Auth::user();

        $albums = AlbumPurchase::where('client_id', $client->id)
            ->with(['album.artist.artistProfile', 'album.tracks'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Client/LibraryAlbums', [
            'albums' => $albums,
        ]);
    }

    /**
     * Retourne uniquement les playlists
     * 
     * Route: GET /library/playlists
     */
    public function playlists(): Response
    {
        $client = Auth::user();

        $playlists = $client->clientProfile->playlists()
            ->with(['tracks.album.artist.artistProfile'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Client/LibraryPlaylists', [
            'playlists' => $playlists,
        ]);
    }
}
