<?php

namespace App\Notifications;

use App\Models\Album;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class NewAlbumReleasedNotification extends Notification
{
    use Queueable;

    public function __construct(public Album $album) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        $artistName = $this->album->artist->artistProfile?->stage_name
            ?? $this->album->artist->name;

        return [
            'type' => 'new_album_released',
            'title' => 'Nouvel album disponible',
            'message' => $artistName.' vient de sortir "'.$this->album->title.'".',
            'album_id' => $this->album->id,
            'cover_url' => $this->album->cover_url,
            'action_url' => '/artstream/album/'.$this->album->id,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
