<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification as FcmNotification;

class TicketResponseNotification extends Notification
{
    use Queueable;

    public function __construct(public Ticket $ticket) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['database', 'mail'];

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
            $title = "Réponse à votre demande #{$this->ticket->ticket_number}";
            $messageBody = "L'équipe ARTEMO a répondu à votre demande : \"{$this->ticket->subject}\"";

            $message = CloudMessage::withTarget('token', $notifiable->fcm_token)
                ->withNotification(FcmNotification::create($title, $messageBody))
                ->withData([
                    'type' => 'ticket_response',
                    'ticket_id' => $this->ticket->id,
                    'action_url' => "/support/{$this->ticket->id}",
                ]);

            $messaging->send($message);
        } catch (\Throwable) {
            // Silently fail for invalid/expired tokens
        }
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Réponse à votre demande #{$this->ticket->ticket_number}")
            ->greeting('Bonjour '.$notifiable->name)
            ->line("L'équipe ARTEMO a répondu à votre demande de support : \"{$this->ticket->subject}\".")
            ->line('Vous pouvez consulter la réponse et suivre l\'état de votre demande en cliquant sur le bouton ci-dessous.')
            ->action('Voir la réponse', url("/support/{$this->ticket->id}"))
            ->line('Merci de nous faire confiance.');
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'ticket_response',
            'title' => "Réponse à votre demande #{$this->ticket->ticket_number}",
            'message' => "Une réponse a été apportée à votre ticket : \"{$this->ticket->subject}\"",
            'ticket_id' => $this->ticket->id,
            'action_url' => "/support/{$this->ticket->id}",
        ];
    }
}
