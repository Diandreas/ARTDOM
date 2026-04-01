import { Head, Link, router } from '@inertiajs/react';
import {
    Play,
    Heart,
    Clock,
    TrendingUp,
    ListMusic,
    Search,
    Flame,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import AddToPlaylistDialog from '@/components/Player/AddToPlaylistDialog';
import { useAudio, type Track as AudioTrack } from '@/contexts/AudioContext';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';

interface Artist {
    id: string;
    name?: string;
    stage_name: string;
    profile_photo?: string;
}

interface Album {
    id: string;
    title: string;
    cover_url: string;
    genre: string;
    year: number;
    price?: number;
    total_plays?: number;
    tracks_count?: number;
    artist: Artist;
}

interface Track {
    id: string;
    title: string;
    duration_seconds: number;
    plays: number;
    file_url: string;
    comments?: unknown[];
    album: {
        id: string;
        title: string;
        cover_url: string;
        artist: Artist;
    };
}

interface MusicHubProps {
    featuredAlbums: Album[];
    recentAlbums: Album[];
    topTracks: Track[];
    genres: string[];
}

const GENRE_EMOJIS: Record<string, string> = {
    afrobeat: '🥁',
    'coupé-décalé': '💃',
    makossa: '🎷',
    rumba: '🎸',
    highlife: '✨',
    gospel: '🙌',
    'hip-hop': '🎤',
    'r&b': '🎵',
    jazz: '🎺',
};

export default function MusicHub({
    featuredAlbums,
    recentAlbums,
    topTracks,
    genres,
}: MusicHubProps) {
    const { t } = useAppLocale();
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'albums' | 'recent' | 'tracks'>(
        'albums',
    );
    const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
    const { setQueue, playTrack } = useAudio();

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const formatPlays = (plays: number) => {
        if (plays >= 1_000_000) return `${(plays / 1_000_000).toFixed(1)}M`;
        if (plays >= 1_000) return `${(plays / 1_000).toFixed(1)}K`;
        return plays.toString();
    };

    const convertToAudioTrack = (track: Track): AudioTrack => ({
        id: track.id,
        title: track.title,
        artist: track.album.artist.stage_name,
        image: track.album.cover_url,
        url: track.file_url,
        duration: track.duration_seconds,
        album: track.album.title,
        comments: track.comments ?? [],
    });

    const handlePlayTrack = (track: Track, allTracks?: Track[]) => {
        if (allTracks && allTracks.length > 0) {
            setQueue(
                allTracks.map(convertToAudioTrack),
                allTracks.findIndex((t) => t.id === track.id),
            );
        } else {
            playTrack(convertToAudioTrack(track));
        }
        router.visit('/artstream/player');
    };

    const handlePlayAlbum = (albumId: string) =>
        router.visit(`/artstream/album/${albumId}`);

    const featuredAlbum = featuredAlbums[0];
    const filteredFeatured = featuredAlbums.filter(
        (a) => !selectedGenre || a.genre === selectedGenre,
    );
    const filteredRecent = recentAlbums.filter(
        (a) => !selectedGenre || a.genre === selectedGenre,
    );

    return (
        <MainLayout>
            <Head title={t('ArtStream - African streaming')} />

            <div className="min-h-screen bg-background pb-28 text-foreground md:pb-8">
                {/* ── KENTE IDENTITY STRIP ── */}
                <div
                    aria-hidden="true"
                    className="h-1 w-full"
                    style={{
                        background:
                            'repeating-linear-gradient(90deg,var(--color-primary) 0,var(--color-primary) 12px,transparent 12px,transparent 16px,#c0392b 16px,#c0392b 28px,transparent 28px,transparent 32px,#27ae60 32px,#27ae60 44px,transparent 44px,transparent 48px)',
                    }}
                />

                {/* ── HERO ── */}
                {featuredAlbum && (
                    <div className="relative flex min-h-[440px] items-end overflow-hidden md:min-h-[520px]">
                        {/* Blurred album art background */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 scale-110"
                            style={{
                                backgroundImage: `url(${featuredAlbum.cover_url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'blur(40px) saturate(1.2)',
                                opacity: 0.25,
                            }}
                        />
                        {/* Gradient overlay — adapts to light/dark */}
                        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />

                        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-14">
                            <div className="flex flex-col items-end gap-6 md:flex-row md:gap-10">
                                {/* Album art */}
                                <button
                                    onClick={() =>
                                        handlePlayAlbum(featuredAlbum.id)
                                    }
                                    className="shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-primary/20 transition-transform duration-300 hover:scale-[1.02]"
                                    style={{ width: 200, height: 200 }}
                                >
                                    <img
                                        src={featuredAlbum.cover_url}
                                        alt={featuredAlbum.title}
                                        className="h-full w-full object-cover"
                                    />
                                </button>

                                {/* Info */}
                                <div className="min-w-0 flex-1 space-y-3">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-primary uppercase">
                                        <Flame size={11} />
                                        {t('Album of the moment')}
                                    </span>

                                    <h1 className="text-3xl leading-none font-black tracking-tight text-foreground md:text-5xl">
                                        {featuredAlbum.title}
                                    </h1>
                                    <p className="text-lg font-medium text-muted-foreground">
                                        {featuredAlbum.artist.stage_name}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-primary uppercase">
                                            {featuredAlbum.genre}
                                        </span>
                                        <span>{featuredAlbum.year}</span>
                                        {featuredAlbum.tracks_count && (
                                            <>
                                                <span>·</span>
                                                <span>
                                                    {featuredAlbum.tracks_count}{' '}
                                                    {featuredAlbum.tracks_count >
                                                    1
                                                        ? t('tracks')
                                                        : t('track')}
                                                </span>
                                            </>
                                        )}
                                        {(featuredAlbum.total_plays ?? 0) >
                                            0 && (
                                            <>
                                                <span>·</span>
                                                <span className="flex items-center gap-1 font-semibold text-primary">
                                                    <TrendingUp size={12} />
                                                    {formatPlays(
                                                        featuredAlbum.total_plays!,
                                                    )}{' '}
                                                    {t('plays')}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex gap-3 pt-1">
                                        <button
                                            onClick={() =>
                                                handlePlayAlbum(
                                                    featuredAlbum.id,
                                                )
                                            }
                                            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-[1.02] hover:bg-primary/90 hover:shadow-primary/50"
                                        >
                                            <Play
                                                size={15}
                                                fill="currentColor"
                                            />
                                            {t('Listen')}
                                        </button>
                                        <button className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors duration-200 hover:bg-muted">
                                            <Heart size={15} />
                                            {t('Like')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mx-auto mt-6 max-w-7xl space-y-8 px-4 md:px-6">
                    {/* ── QUICK LINKS ── */}
                    <div className="flex gap-2.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                        {[
                            {
                                href: '/artstream/search',
                                icon: <Search size={14} />,
                                label: t('Search'),
                            },
                            {
                                href: '/playlists',
                                icon: <ListMusic size={14} />,
                                label: t('My Playlists'),
                            },
                            {
                                href: '/favorites',
                                icon: <Heart size={14} />,
                                label: t('My Favorites'),
                            },
                        ].map(({ href, icon, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-all duration-150 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                            >
                                {icon}
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* ── GENRE CHIPS ── */}
                    <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                        <GenreChip
                            active={selectedGenre === null}
                            onClick={() => setSelectedGenre(null)}
                        >
                            {t('All')}
                        </GenreChip>
                        {genres.map((genre) => (
                            <GenreChip
                                key={genre}
                                active={selectedGenre === genre}
                                onClick={() => setSelectedGenre(genre)}
                            >
                                {GENRE_EMOJIS[genre] && (
                                    <span className="mr-1">
                                        {GENRE_EMOJIS[genre]}
                                    </span>
                                )}
                                <span className="capitalize">{genre}</span>
                            </GenreChip>
                        ))}
                    </div>

                    {/* ── TABS ── */}
                    <div className="flex w-fit gap-1 rounded-xl bg-muted p-1">
                        {(['albums', 'recent', 'tracks'] as const).map(
                            (tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                                        activeTab === tab
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {tab === 'albums'
                                        ? t('Popular albums')
                                        : tab === 'recent'
                                          ? t('New music releases')
                                          : t('Top tracks')}
                                </button>
                            ),
                        )}
                    </div>

                    {/* ── ALBUMS POPULAIRES ── */}
                    {activeTab === 'albums' && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {filteredFeatured.map((album) => (
                                <AlbumCard
                                    key={album.id}
                                    album={album}
                                    onPlay={handlePlayAlbum}
                                    formatPlays={formatPlays}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── NEW RELEASES ── */}
                    {activeTab === 'recent' && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {filteredRecent.map((album) => (
                                <AlbumCard
                                    key={album.id}
                                    album={album}
                                    onPlay={handlePlayAlbum}
                                    formatPlays={formatPlays}
                                    compact
                                />
                            ))}
                        </div>
                    )}

                    {/* ── TOP TITRES ── */}
                    {activeTab === 'tracks' && (
                        <div className="overflow-hidden rounded-2xl border border-border bg-card">
                            {/* Table header */}
                            <div
                                className="grid items-center gap-4 border-b border-border px-5 py-3 text-[11px] font-bold tracking-widest text-muted-foreground uppercase"
                                style={{
                                    gridTemplateColumns:
                                        '32px 1fr 80px 60px 36px',
                                }}
                            >
                                <span className="text-center">#</span>
                                <span>Titre</span>
                                <span className="text-right">{t('plays')}</span>
                                <span className="text-right">
                                    {t('Duration')}
                                </span>
                                <span />
                            </div>
                            {topTracks.map((track, index) => (
                                <TrackRow
                                    key={track.id}
                                    track={track}
                                    index={index}
                                    hovered={hoveredTrack === track.id}
                                    onHover={setHoveredTrack}
                                    onPlay={() =>
                                        handlePlayTrack(track, topTracks)
                                    }
                                    formatPlays={formatPlays}
                                    formatDuration={formatDuration}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── TOP 5 TEASER (visible on albums/recent tabs) ── */}
                    {activeTab !== 'tracks' && topTracks.length > 0 && (
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-lg font-black tracking-tight text-foreground">
                                    <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                                    {t('Right now')}
                                </h2>
                                <button
                                    onClick={() => setActiveTab('tracks')}
                                    className="flex items-center gap-1 text-sm font-semibold text-primary underline-offset-2 hover:underline"
                                >
                                    {t('See all')} <ChevronRight size={14} />
                                </button>
                            </div>
                            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                                {topTracks.slice(0, 5).map((track, index) => (
                                    <TrackRow
                                        key={track.id}
                                        track={track}
                                        index={index}
                                        hovered={hoveredTrack === track.id}
                                        onHover={setHoveredTrack}
                                        onPlay={() =>
                                            handlePlayTrack(track, topTracks)
                                        }
                                        formatPlays={formatPlays}
                                        formatDuration={formatDuration}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

/* ── Sub-components ── */

function GenreChip({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                active
                    ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary'
            }`}
        >
            {children}
        </button>
    );
}

function AlbumCard({
    album,
    onPlay,
    formatPlays,
    compact = false,
}: {
    album: Album;
    onPlay: (id: string) => void;
    formatPlays: (n: number) => string;
    compact?: boolean;
}) {
    return (
        <div className="group cursor-pointer" onClick={() => onPlay(album.id)}>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted ring-1 ring-border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:ring-primary/40">
                <img
                    src={album.cover_url}
                    alt={album.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-primary shadow-xl shadow-primary/40 transition-transform duration-300 group-hover:scale-100">
                        <Play
                            size={18}
                            fill="currentColor"
                            className="ml-0.5 text-primary-foreground"
                        />
                    </div>
                </div>
                {/* Plays badge */}
                {(album.total_plays ?? 0) > 0 && !compact && (
                    <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                        {formatPlays(album.total_plays!)}
                    </div>
                )}
            </div>
            <div className="mt-2.5 space-y-0.5 px-0.5">
                <p className="truncate text-sm leading-tight font-semibold text-foreground">
                    {album.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                    {album.artist.stage_name}
                </p>
                {!compact && (
                    <p className="text-[10px] font-bold tracking-wide text-primary/70 uppercase">
                        {album.genre}
                    </p>
                )}
            </div>
        </div>
    );
}

function TrackRow({
    track,
    index,
    hovered,
    onHover,
    onPlay,
    formatPlays,
    formatDuration,
}: {
    track: Track;
    index: number;
    hovered: boolean;
    onHover: (id: string | null) => void;
    onPlay: () => void;
    formatPlays: (n: number) => string;
    formatDuration: (s: number) => string;
}) {
    return (
        <div
            className={`grid cursor-pointer items-center gap-4 px-5 py-3 transition-colors duration-150 ${hovered ? 'bg-muted/60' : 'hover:bg-muted/40'}`}
            style={{ gridTemplateColumns: '32px 1fr 80px 60px 36px' }}
            onMouseEnter={() => onHover(track.id)}
            onMouseLeave={() => onHover(null)}
            onClick={onPlay}
        >
            {/* Rank / play icon */}
            <div className="relative flex h-6 w-6 items-center justify-center">
                <span
                    className={`absolute text-sm font-bold text-muted-foreground transition-opacity duration-150 ${hovered ? 'opacity-0' : 'opacity-100'}`}
                >
                    {index + 1}
                </span>
                <Play
                    size={14}
                    fill="currentColor"
                    className={`absolute text-primary transition-opacity duration-150 ${hovered ? 'opacity-100' : 'opacity-0'}`}
                />
            </div>

            {/* Track info */}
            <div className="flex min-w-0 items-center gap-3">
                <img
                    src={track.album.cover_url}
                    alt={track.album.title}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                        {track.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                        {track.album.artist.stage_name}
                        <span className="mx-1.5 opacity-40">·</span>
                        {track.album.title}
                    </p>
                </div>
            </div>

            {/* Plays */}
            <div className="flex items-center justify-end gap-1.5 text-sm text-muted-foreground">
                <TrendingUp
                    size={11}
                    className="shrink-0 text-primary opacity-70"
                />
                {formatPlays(track.plays)}
            </div>

            {/* Duration */}
            <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                <Clock size={10} className="shrink-0" />
                {formatDuration(track.duration_seconds)}
            </div>

            {/* Actions */}
            <div
                className={`flex justify-end transition-opacity duration-150 ${hovered ? 'opacity-100' : 'opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <AddToPlaylistDialog
                    trackId={track.id}
                    trackTitle={track.title}
                    trigger={
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                            <ListMusic size={13} />
                        </button>
                    }
                />
            </div>
        </div>
    );
}
