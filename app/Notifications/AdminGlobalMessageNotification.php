<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification as FcmNotification;

class AdminGlobalMessageNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $title,
        public string $message,
        public bool $sendEmail = false,
        public ?string $actionUrl = null,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['database'];

        if ($this->sendEmail) {
            $channels[] = 'mail';
        }

        if (! empty($notifiable->fcm_token)) {
            $channels[] = 'fcm';
        }

        return $channels;
    }

    public function toFcm(object $notifiable): void
    {
        if (empty($notifiable->fcm_token)) {
            return;
        }

        try {
            $messaging = app(Messaging::class);

            $message = CloudMessage::withTarget('token', $notifiable->fcm_token)
                ->withNotification(FcmNotification::create($this->title, $this->message))
                ->withData(array_filter([
                    'type' => 'admin_global_message',
                    'action_url' => $this->actionUrl ?? '',
                ]));

            $messaging->send($message);
        } catch (\Throwable) {
            // Silently fail for invalid/expired tokens
        }
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject($this->title)
            ->greeting('Message ARTEMO')
            ->line($this->message);

        if (! empty($this->actionUrl)) {
            $mail->action('Ouvrir', url($this->actionUrl));
        }

        return $mail;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'admin_global_message',
            'title' => $this->title,
            'message' => $this->message,
            'action_url' => $this->actionUrl,
        ];
    }
}
