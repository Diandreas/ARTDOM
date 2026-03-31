<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTrackCommentRequest;
use App\Models\Track;
use App\Models\TrackComment;
use App\Notifications\NewTrackCommentNotification;
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

        $comment = TrackComment::create([
            'track_id' => $track->id,
            'user_id' => Auth::id(),
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
        ]);

        // Notifier l'artiste propriétaire du titre (sauf si c'est lui qui commente)
        $artistUser = $track->album?->artist;
        if ($artistUser && $artistUser->id !== Auth::id()) {
            $artistUser->notify(new NewTrackCommentNotification($comment->load('user', 'track')));
        }

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Commentaire ajoute avec succes.',
        ]);
    }
}
