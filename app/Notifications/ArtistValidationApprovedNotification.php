<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ArtistValidationApprovedNotification extends Notification
{
    use Queueable;

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Compte artiste approuve')
            ->greeting('Felicitation !')
            ->line('Votre profil artiste a ete approuve par notre equipe.')
            ->line('Votre badge verifie est maintenant actif.')
            ->action('Voir mon profil', url('/artist/dashboard'))
            ->line('Vous pouvez desormais etre visible publiquement sur ARTDOM.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'artist_validation_approved',
            'title' => 'Validation approuvee',
            'message' => 'Votre profil artiste est verifie et visible publiquement.',
            'action_url' => '/artist/dashboard',
        ];
    }
}
