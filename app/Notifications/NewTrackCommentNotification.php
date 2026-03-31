<?php

namespace App\Notifications;

use App\Models\TrackComment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class NewTrackCommentNotification extends Notification
{
    use Queueable;

    public function __construct(public TrackComment $comment) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        $commenterName = $this->comment->user->name ?? 'Un utilisateur';
        $trackTitle = $this->comment->track->title ?? 'votre titre';

        return [
            'type' => 'new_track_comment',
            'title' => 'Nouveau commentaire',
            'message' => $commenterName.' a commenté "'.$trackTitle.'" : '.
                \Illuminate\Support\Str::limit($this->comment->content, 60),
            'track_id' => $this->comment->track_id,
            'comment_id' => $this->comment->id,
            'action_url' => '/artstream/player?track='.$this->comment->track_id,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
