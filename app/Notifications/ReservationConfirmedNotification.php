<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationConfirmedNotification extends Notification
{
    use Queueable;

    public function __construct(public Reservation $reservation) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Réservation confirmée — '.$this->reservation->service->title)
            ->greeting('Bonne nouvelle !')
            ->line('Votre réservation a été confirmée par l\'artiste.')
            ->line('Prestation : '.$this->reservation->service->title)
            ->line('Date : '.$this->reservation->scheduled_at->format('d/m/Y à H:i'))
            ->action('Voir ma réservation', url('/dashboard/reservations/'.$this->reservation->id))
            ->line('Merci de faire confiance à Artemo !');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'reservation_confirmed',
            'title' => 'Réservation confirmée',
            'message' => 'Votre réservation "'.$this->reservation->service->title.'" a été confirmée.',
            'reservation_id' => $this->reservation->id,
            'action_url' => '/dashboard/reservations/'.$this->reservation->id,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
