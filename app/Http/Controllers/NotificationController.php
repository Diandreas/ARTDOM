<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\FirebaseNotificationService;

class NotificationController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        return Inertia::render('Notifications/Index', [
            'notifications' => $user->notifications()->take(50)->get(),
            'unreadCount' => $user->unreadNotifications()->count(),
        ]);
    }

    public function markAsRead($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();

        return back();
    }

    public function destroy($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->delete();

        return back();
    }

    /**
     * Update the authenticated user's FCM token (for push notifications).
     * Accepts POST { token: string|null } and saves it on the users table.
     */
    public function updateToken(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'token' => ['nullable', 'string', 'max:1024'],
        ]);

        $user = Auth::user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $user->fcm_token = $request->input('token');
        $user->save();

        return response()->json(['message' => 'FCM token updated.']);
    }

    /**
     * Send a test push to the authenticated user (useful for debugging).
     */
    public function testPush(Request $request, FirebaseNotificationService $firebase)
    {
        $user = Auth::user();

        if (! $user || ! $user->fcm_token) {
            return response()->json(['message' => 'No FCM token registered for this user.'], 400);
        }

        try {
            $firebase->sendToUser($user->fcm_token, 'Test notification', 'This is a test push notification from the server', ['route' => '/']);
        } catch (\Throwable $e) {
            report($e);
            return response()->json(['message' => 'Failed to send notification', 'error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Test notification sent.']);
    }
}
