<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReservationNotification extends Notification
{
    use Queueable;

    public function __construct(public Reservation $reservation) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $clientName = $this->reservation->client->clientProfile?->first_name
            ?? $this->reservation->client->name;

        return (new MailMessage)
            ->subject('Nouvelle demande de réservation')
            ->greeting('Vous avez une nouvelle réservation !')
            ->line($clientName.' souhaite vous réserver pour "'.$this->reservation->service->title.'".')
            ->line('Date souhaitée : '.$this->reservation->scheduled_at->format('d/m/Y à H:i'))
            ->line('Montant : '.number_format($this->reservation->total_amount, 0, ',', ' ').' FCFA')
            ->action('Voir la demande', url('/artist/orders/'.$this->reservation->id))
            ->line('Acceptez ou refusez rapidement pour ne pas faire attendre le client.');
    }

    public function toArray(object $notifiable): array
    {
        $clientName = $this->reservation->client->clientProfile?->first_name
            ?? $this->reservation->client->name;

        return [
            'type' => 'new_reservation',
            'title' => 'Nouvelle réservation',
            'message' => $clientName.' veut vous réserver pour "'.$this->reservation->service->title.'".',
            'reservation_id' => $this->reservation->id,
            'action_url' => '/artist/orders/'.$this->reservation->id,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
