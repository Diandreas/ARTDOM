<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationAcceptedNotification extends Notification
{
    use Queueable;

    public function __construct(public Reservation $reservation) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $artistName = $this->reservation->artist->artistProfile?->stage_name
            ?? $this->reservation->artist->name;

        return (new MailMessage)
            ->subject('Votre réservation a été acceptée !')
            ->greeting('Bonne nouvelle !')
            ->line($artistName.' a accepté votre demande de réservation pour "'.$this->reservation->service->title.'".')
            ->line('Date et heure : '.$this->reservation->scheduled_at->format('d/m/Y à H:i'))
            ->line('Vous pouvez maintenant suivre les détails de votre réservation dans votre espace client.')
            ->action('Voir ma réservation', url('/client/reservations/'.$this->reservation->id))
            ->line('Merci de votre confiance en ARTDOM !');
    }

    public function toArray(object $notifiable): array
    {
        $artistName = $this->reservation->artist->artistProfile?->stage_name
            ?? $this->reservation->artist->name;

        return [
            'type' => 'reservation_accepted',
            'title' => 'Réservation acceptée',
            'message' => $artistName.' a accepté votre réservation.',
            'reservation_id' => $this->reservation->id,
            'action_url' => '/client/reservations/'.$this->reservation->id,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
