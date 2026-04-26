<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Track;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrackManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $tracks = Track::with(['album.artist'])
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Tracks/Index', [
            'tracks' => $tracks,
            'filters' => $request->only(['search']),
        ]);
    }

    public function ban(Request $request, Track $track): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        $track->update([
            'is_banned' => true,
            'ban_reason' => $validated['reason'] ?? null,
        ]);

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Musique bannie avec succès',
        ]);
    }

    public function unban(Track $track): RedirectResponse
    {
        $track->update([
            'is_banned' => false,
            'ban_reason' => null,
        ]);

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Bannissement levé',
        ]);
    }
}
