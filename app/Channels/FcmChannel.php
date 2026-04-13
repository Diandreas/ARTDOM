<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;
use Kreait\Firebase\Contract\Messaging;

class FcmChannel
{
    public function __construct(private readonly Messaging $messaging) {}

    public function send(object $notifiable, Notification $notification): void
    {
        $token = $notifiable->fcm_token ?? null;

        if (empty($token) || ! method_exists($notification, 'toFcm')) {
            return;
        }

        $notification->toFcm($notifiable);
    }
}
