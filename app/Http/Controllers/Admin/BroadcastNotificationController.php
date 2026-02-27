<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBroadcastNotificationRequest;
use App\Models\User;
use App\Notifications\AdminGlobalMessageNotification;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BroadcastNotificationController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Admin/BroadcastNotification');
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

        $query->chunk(500, function ($users) use (&$recipientsCount, $notification): void {
            foreach ($users as $user) {
                $user->notify($notification);
                $recipientsCount++;
            }
        });

        return back()->with('message', 'Notification globale envoyee a '.$recipientsCount.' utilisateur(s).');
    }
}
