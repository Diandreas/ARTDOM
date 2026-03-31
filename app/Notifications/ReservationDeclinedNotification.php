<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationDeclinedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Reservation $reservation,
        public ?string $reason = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject('Réservation refusée — '.$this->reservation->service->title)
            ->greeting('Mise à jour de votre réservation')
            ->line('Votre demande de réservation a été refusée par l\'artiste.')
            ->line('Prestation : '.$this->reservation->service->title);

        if ($this->reason) {
            $mail->line('Motif : '.$this->reason);
        }

        return $mail
            ->action('Trouver un autre artiste', url('/'))
            ->line('Vous pouvez réserver un autre artiste sur Artemo.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'reservation_declined',
            'title' => 'Réservation refusée',
            'message' => 'Votre réservation "'.$this->reservation->service->title.'" a été refusée.',
            'reservation_id' => $this->reservation->id,
            'reason' => $this->reason,
            'action_url' => '/',
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
