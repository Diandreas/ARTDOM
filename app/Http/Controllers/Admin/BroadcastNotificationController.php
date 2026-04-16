<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBroadcastNotificationRequest;
use App\Models\Album;
use App\Models\Track;
use App\Models\User;
use App\Notifications\AdminGlobalMessageNotification;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BroadcastNotificationController extends Controller
{
    public function create(): Response
    {
        $audienceStats = [
            'all' => User::count(),
            'client' => User::where('role', 'client')->count(),
            'artist' => User::where('role', 'artist')->count(),
            'admin' => User::where('role', 'admin')->count(),
            'with_fcm' => User::whereNotNull('fcm_token')->count(),
        ];

        return Inertia::render('Admin/BroadcastNotification', [
            'audienceStats' => $audienceStats,
            'flash' => ['message' => session('message')],
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q', '');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $artists = User::where('role', 'artist')
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhereHas('artistProfile', function ($profileQ) use ($query) {
                        $profileQ->where('stage_name', 'like', "%{$query}%");
                    });
            })
            ->with('artistProfile')
            ->limit(5)
            ->get()
            ->map(fn ($user) => [
                'type' => 'artist',
                'id' => $user->id,
                'title' => $user->artistProfile->stage_name ?? $user->name,
                'url' => "/artists/{$user->id}",
            ]);

        $tracks = Track::where('title', 'like', "%{$query}%")
            ->with('album.artist.artistProfile')
            ->limit(5)
            ->get()
            ->map(fn ($track) => [
                'type' => 'track',
                'id' => $track->id,
                'title' => "Track: {$track->title}",
                'subtitle' => $track->album->artist->artistProfile->stage_name ?? '?',
                'url' => "/artstream/player?track={$track->id}",
            ]);

        $albums = Album::where('title', 'like', "%{$query}%")
            ->with('artist.artistProfile')
            ->limit(5)
            ->get()
            ->map(fn ($album) => [
                'type' => 'album',
                'id' => $album->id,
                'title' => "Album: {$album->title}",
                'subtitle' => $album->artist->artistProfile->stage_name ?? '?',
                'url' => "/artstream/album/{$album->id}",
            ]);

        return response()->json($artists->concat($tracks)->concat($albums));
    }

    public function store(StoreBroadcastNotificationRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $query = User::query();

        if ($validated['target_role'] !== 'all') {
            $query->where('role', $validated['target_role']);
        }

        if (! empty($validated['only_active'])) {
            $query->where('is_active', true);
        }

        $notification = new AdminGlobalMessageNotification(
            title: $validated['title'],
            message: $validated['message'],
            sendEmail: (bool) ($validated['send_email'] ?? false),
            actionUrl: $validated['action_url'] ?? null,
        );

        $recipientsCount = 0;

        $query->chunk(500, function (Collection $users) use (&$recipientsCount, $notification): void {
            foreach ($users as $user) {
                /** @var User $user */
                $user->notify($notification);
                $recipientsCount++;
            }
        });

        return back()->with('message', 'Notification globale envoyee a '.$recipientsCount.' utilisateur(s).');
    }
}
