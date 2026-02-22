<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ArtistValidationRejectedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $reasonLabel,
        public ?string $customMessage,
        public bool $allowResubmission,
    ) {}

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
        $mail = (new MailMessage)
            ->subject('Demande artiste refusee')
            ->greeting('Mise a jour de votre dossier artiste')
            ->line('Votre demande de validation artiste a ete refusee.')
            ->line('Motif principal: '.$this->reasonLabel);

        if (! empty($this->customMessage)) {
            $mail->line('Message de l\'equipe: '.$this->customMessage);
        }

        if ($this->allowResubmission) {
            $mail->line('Vous etes autorise a corriger puis resoumettre votre dossier.');
        }

        return $mail
            ->action('Retourner sur mon profil', url('/artist/dashboard'))
            ->line('Merci de votre comprehension.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'artist_validation_rejected',
            'title' => 'Validation refusee',
            'reason' => $this->reasonLabel,
            'custom_message' => $this->customMessage,
            'allow_resubmission' => $this->allowResubmission,
            'action_url' => '/artist/dashboard',
        ];
    }
}
