import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    ThumbsUp,
    Share2,
    Eye,
    Clock,
    MessageCircle,
    Play,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Artist {
    id: string;
    stage_name: string;
    profile_photo?: string;
}

interface Comment {
    id: string;
    content: string;
    created_at: string;
    user: {
        id: string;
        name: string;
        profile_photo_url?: string;
    };
    replies?: Comment[];
}

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    video_url: string;
    duration_seconds: number;
    views: number;
    likes: number;
    category: string;
    published_at: string;
    artist: {
        id: string;
        artist_profile: Artist;
    };
    comments: Comment[];
}

interface VideoPlayerProps {
    video: Video;
    suggested: Video[];
}

export default function VideoPlayer({ video, suggested }: VideoPlayerProps) {
    const [showDescription, setShowDescription] = useState(false);
    const [autoplayEnabled, setAutoplayEnabled] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const { data, setData, post, processing, reset } = useForm({
        content: '',
    });

    const formatViews = (views: number) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views.toString();
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'À l\'instant';
        if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
        if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVideoEnd = () => {
        if (autoplayEnabled && suggested.length > 0) {
            // Auto-play next suggested video
            const nextVideo = suggested[0];
            router.visit(`/arttube/videos/${nextVideo.id}`);
        }
    };

    const handleLike = () => {
        router.post(`/arttube/videos/${video.id}/like`, {}, {
            preserveScroll: true,
        });
    };

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/arttube/videos/${video.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('ended', handleVideoEnd);
            return () => {
                videoElement.removeEventListener('ended', handleVideoEnd);
            };
        }
    }, [autoplayEnabled, suggested]);

    return (
        <MainLayout>
            <Head title={`${video.title} - ArtTube`} />

            <div className="pb-24 md:pb-6">
                <div className="container max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Video Section */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Video Player */}
                            <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                <video
                                    ref={videoRef}
                                    src={video.video_url}
                                    controls
                                    autoPlay
                                    className="w-full h-full"
                                    poster={video.thumbnail_url}
                                >
                                    Votre navigateur ne supporte pas la lecture vidéo.
                                </video>
                            </div>

                            {/* Video Info */}
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-bold font-heading mb-2">{video.title}</h1>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {formatViews(video.views)} vues
                                        </span>
                                        <span>•</span>
                                        <span>{formatTimeAgo(video.published_at)}</span>
                                        <Badge variant="outline" className="capitalize">
                                            {video.category}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Artist Info & Actions */}
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={`/artist/${video.artist.id}`}
                                                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                            >
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={video.artist.artist_profile.profile_photo} />
                                                    <AvatarFallback>
                                                        {video.artist.artist_profile.stage_name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{video.artist.artist_profile.stage_name}</p>
                                                    <p className="text-sm text-muted-foreground">Artiste</p>
                                                </div>
                                            </Link>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleLike}
                                                    className="gap-2"
                                                >
                                                    <ThumbsUp className="w-4 h-4" />
                                                    {formatViews(video.likes)}
                                                </Button>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Share2 className="w-4 h-4" />
                                                    Partager
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="mt-4 pt-4 border-t">
                                            <div
                                                className={cn(
                                                    'text-sm text-muted-foreground whitespace-pre-wrap',
                                                    !showDescription && 'line-clamp-2'
                                                )}
                                            >
                                                {video.description}
                                            </div>
                                            {video.description && video.description.length > 100 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setShowDescription(!showDescription)}
                                                    className="mt-2 gap-1"
                                                >
                                                    {showDescription ? (
                                                        <>
                                                            Voir moins <ChevronUp className="w-4 h-4" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Voir plus <ChevronDown className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Comments Section */}
                                <Card>
                                    <CardContent className="p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold flex items-center gap-2">
                                                <MessageCircle className="w-4 h-4" />
                                                {video.comments.length} commentaire{video.comments.length !== 1 ? 's' : ''}
                                            </h3>
                                        </div>

                                        {/* Add Comment Form */}
                                        <form onSubmit={handleComment} className="space-y-2">
                                            <Textarea
                                                placeholder="Ajouter un commentaire..."
                                                value={data.content}
                                                onChange={(e) => setData('content', e.target.value)}
                                                className="resize-none"
                                                rows={3}
                                            />
                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={processing || !data.content.trim()}>
                                                    Commenter
                                                </Button>
                                            </div>
                                        </form>

                                        {/* Comments List */}
                                        <div className="space-y-4 mt-6">
                                            {video.comments.map((comment) => (
                                                <div key={comment.id} className="space-y-2">
                                                    <div className="flex gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={comment.user.profile_photo_url} />
                                                            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-semibold">{comment.user.name}</p>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {formatTimeAgo(comment.created_at)}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-foreground">{comment.content}</p>
                                                        </div>
                                                    </div>

                                                    {/* Replies */}
                                                    {comment.replies && comment.replies.length > 0 && (
                                                        <div className="ml-11 space-y-2">
                                                            {comment.replies.map((reply) => (
                                                                <div key={reply.id} className="flex gap-3">
                                                                    <Avatar className="h-7 w-7">
                                                                        <AvatarImage src={reply.user.profile_photo_url} />
                                                                        <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex-1 space-y-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <p className="text-sm font-semibold">{reply.user.name}</p>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {formatTimeAgo(reply.created_at)}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-sm text-foreground">{reply.content}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Sidebar - Suggested Videos */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">Vidéos suggérées</h3>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={autoplayEnabled}
                                        onChange={(e) => setAutoplayEnabled(e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-muted-foreground">Auto-play</span>
                                </label>
                            </div>

                            <div className="space-y-3">
                                {suggested.map((suggestedVideo) => (
                                    <Link
                                        key={suggestedVideo.id}
                                        href={`/arttube/videos/${suggestedVideo.id}`}
                                        className="group flex gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors"
                                    >
                                        <div className="relative w-40 aspect-video rounded overflow-hidden bg-muted shrink-0">
                                            <img
                                                src={suggestedVideo.thumbnail_url || 'https://picsum.photos/320/180'}
                                                alt={suggestedVideo.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Play className="w-6 h-6 text-white fill-current" />
                                            </div>
                                            <Badge className="absolute bottom-1 right-1 bg-black/70 text-white border-none text-xs">
                                                {formatDuration(suggestedVideo.duration_seconds)}
                                            </Badge>
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                                {suggestedVideo.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {suggestedVideo.artist.artist_profile.stage_name}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{formatViews(suggestedVideo.views)} vues</span>
                                                <span>•</span>
                                                <span>{formatTimeAgo(suggestedVideo.published_at)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {suggested.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    Aucune vidéo suggérée
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
