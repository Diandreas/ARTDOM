<?php

namespace App\Services;

use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

class FirebaseNotificationService
{
    public function __construct(protected Messaging $messaging) {}

    public function sendToUser(string $fcmToken, string $title, string $body, array $data = []): void
    {
        $message = CloudMessage::withTarget('token', $fcmToken)
            ->withNotification(Notification::create($title, $body))
            ->withData($data);

        $this->messaging->send($message);
    }

    public function sendToMultiple(array $tokens, string $title, string $body, array $data = []): void
    {
        $message = CloudMessage::new()
            ->withNotification(Notification::create($title, $body))
            ->withData($data);

        $this->messaging->sendMulticast($message, $tokens);
    }
}
