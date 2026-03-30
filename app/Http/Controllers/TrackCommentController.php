<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTrackCommentRequest;
use App\Models\Track;
use App\Models\TrackComment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class TrackCommentController extends Controller
{
    /**
     * Store a newly created comment for a track.
     */
    public function store(StoreTrackCommentRequest $request, Track $track): RedirectResponse
    {
        $validated = $request->validated();

        TrackComment::create([
            'track_id' => $track->id,
            'user_id' => Auth::id(),
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
        ]);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Commentaire ajoute avec succes.',
        ]);
    }
}
