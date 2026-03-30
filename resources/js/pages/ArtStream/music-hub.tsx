import { Head, Link, router } from '@inertiajs/react';
import { Play, Heart, Clock, TrendingUp, ListMusic, Search, Flame, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import AddToPlaylistDialog from '@/components/Player/AddToPlaylistDialog';
import { useAudio, type Track as AudioTrack } from '@/contexts/AudioContext';
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
    afrobeat: '🥁', 'coupé-décalé': '💃', makossa: '🎷', rumba: '🎸',
    highlife: '✨', gospel: '🙌', 'hip-hop': '🎤', 'r&b': '🎵', jazz: '🎺',
};

export default function MusicHub({ featuredAlbums, recentAlbums, topTracks, genres }: MusicHubProps) {
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'albums' | 'recent' | 'tracks'>('albums');
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
            setQueue(allTracks.map(convertToAudioTrack), allTracks.findIndex(t => t.id === track.id));
        } else {
            playTrack(convertToAudioTrack(track));
        }
        router.visit('/artstream/player');
    };

    const handlePlayAlbum = (albumId: string) => router.visit(`/artstream/album/${albumId}`);

    const featuredAlbum = featuredAlbums[0];
    const filteredFeatured = featuredAlbums.filter(a => !selectedGenre || a.genre === selectedGenre);
    const filteredRecent = recentAlbums.filter(a => !selectedGenre || a.genre === selectedGenre);

    return (
        <MainLayout>
            <Head title="ArtStream — Streaming Africa" />

            <div className="min-h-screen bg-background text-foreground pb-28 md:pb-8">

                {/* ── KENTE IDENTITY STRIP ── */}
                <div
                    aria-hidden="true"
                    className="h-1 w-full"
                    style={{
                        background: 'repeating-linear-gradient(90deg,var(--color-primary) 0,var(--color-primary) 12px,transparent 12px,transparent 16px,#c0392b 16px,#c0392b 28px,transparent 28px,transparent 32px,#27ae60 32px,#27ae60 44px,transparent 44px,transparent 48px)',
                    }}
                />

                {/* ── HERO ── */}
                {featuredAlbum && (
                    <div className="relative overflow-hidden min-h-[440px] md:min-h-[520px] flex items-end">
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

                        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
                            <div className="flex flex-col md:flex-row items-end gap-6 md:gap-10">
                                {/* Album art */}
                                <button
                                    onClick={() => handlePlayAlbum(featuredAlbum.id)}
                                    className="shrink-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-primary/20 hover:scale-[1.02] transition-transform duration-300"
                                    style={{ width: 200, height: 200 }}
                                >
                                    <img src={featuredAlbum.cover_url} alt={featuredAlbum.title} className="w-full h-full object-cover" />
                                </button>

                                {/* Info */}
                                <div className="flex-1 min-w-0 space-y-3">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-primary">
                                        <Flame size={11} />
                                        Album du moment
                                    </span>

                                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-none">
                                        {featuredAlbum.title}
                                    </h1>
                                    <p className="text-lg text-muted-foreground font-medium">{featuredAlbum.artist.stage_name}</p>

                                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wide">
                                            {featuredAlbum.genre}
                                        </span>
                                        <span>{featuredAlbum.year}</span>
                                        {featuredAlbum.tracks_count && <><span>·</span><span>{featuredAlbum.tracks_count} titres</span></>}
                                        {(featuredAlbum.total_plays ?? 0) > 0 && (
                                            <><span>·</span>
                                            <span className="flex items-center gap-1 text-primary font-semibold">
                                                <TrendingUp size={12} />{formatPlays(featuredAlbum.total_plays!)} écoutes
                                            </span></>
                                        )}
                                    </div>

                                    <div className="flex gap-3 pt-1">
                                        <button
                                            onClick={() => handlePlayAlbum(featuredAlbum.id)}
                                            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/50 hover:scale-[1.02] transition-all duration-200"
                                        >
                                            <Play size={15} fill="currentColor" />
                                            Écouter
                                        </button>
                                        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-background/50 backdrop-blur text-foreground font-medium text-sm hover:bg-muted transition-colors duration-200">
                                            <Heart size={15} />
                                            J'aime
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6 space-y-8">

                    {/* ── QUICK LINKS ── */}
                    <div className="flex gap-2.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                        {[
                            { href: '/artstream/search', icon: <Search size={14} />, label: 'Rechercher' },
                            { href: '/playlists', icon: <ListMusic size={14} />, label: 'Mes Playlists' },
                            { href: '/favorites', icon: <Heart size={14} />, label: 'Mes Favoris' },
                        ].map(({ href, icon, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-muted-foreground text-sm font-medium whitespace-nowrap hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                            >
                                {icon}{label}
                            </Link>
                        ))}
                    </div>

                    {/* ── GENRE CHIPS ── */}
                    <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                        <GenreChip active={selectedGenre === null} onClick={() => setSelectedGenre(null)}>
                            Tout
                        </GenreChip>
                        {genres.map(genre => (
                            <GenreChip key={genre} active={selectedGenre === genre} onClick={() => setSelectedGenre(genre)}>
                                {GENRE_EMOJIS[genre] && <span className="mr-1">{GENRE_EMOJIS[genre]}</span>}
                                <span className="capitalize">{genre}</span>
                            </GenreChip>
                        ))}
                    </div>

                    {/* ── TABS ── */}
                    <div className="flex gap-1 p-1 rounded-xl bg-muted w-fit">
                        {(['albums', 'recent', 'tracks'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                    activeTab === tab
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {tab === 'albums' ? 'Albums populaires' : tab === 'recent' ? 'Nouveautés' : 'Top Titres'}
                            </button>
                        ))}
                    </div>

                    {/* ── ALBUMS POPULAIRES ── */}
                    {activeTab === 'albums' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {filteredFeatured.map(album => (
                                <AlbumCard key={album.id} album={album} onPlay={handlePlayAlbum} formatPlays={formatPlays} />
                            ))}
                        </div>
                    )}

                    {/* ── NOUVEAUTÉS ── */}
                    {activeTab === 'recent' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {filteredRecent.map(album => (
                                <AlbumCard key={album.id} album={album} onPlay={handlePlayAlbum} formatPlays={formatPlays} compact />
                            ))}
                        </div>
                    )}

                    {/* ── TOP TITRES ── */}
                    {activeTab === 'tracks' && (
                        <div className="rounded-2xl border border-border bg-card overflow-hidden">
                            {/* Table header */}
                            <div className="grid items-center gap-4 px-5 py-3 border-b border-border text-[11px] font-bold tracking-widest uppercase text-muted-foreground"
                                style={{ gridTemplateColumns: '32px 1fr 80px 60px 36px' }}>
                                <span className="text-center">#</span>
                                <span>Titre</span>
                                <span className="text-right">Écoutes</span>
                                <span className="text-right">Durée</span>
                                <span />
                            </div>
                            {topTracks.map((track, index) => (
                                <TrackRow
                                    key={track.id}
                                    track={track}
                                    index={index}
                                    hovered={hoveredTrack === track.id}
                                    onHover={setHoveredTrack}
                                    onPlay={() => handlePlayTrack(track, topTracks)}
                                    formatPlays={formatPlays}
                                    formatDuration={formatDuration}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── TOP 5 TEASER (visible on albums/recent tabs) ── */}
                    {activeTab !== 'tracks' && topTracks.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                                    En ce moment
                                </h2>
                                <button
                                    onClick={() => setActiveTab('tracks')}
                                    className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline underline-offset-2"
                                >
                                    Tout voir <ChevronRight size={14} />
                                </button>
                            </div>
                            <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
                                {topTracks.slice(0, 5).map((track, index) => (
                                    <TrackRow
                                        key={track.id}
                                        track={track}
                                        index={index}
                                        hovered={hoveredTrack === track.id}
                                        onHover={setHoveredTrack}
                                        onPlay={() => handlePlayTrack(track, topTracks)}
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

function GenreChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border whitespace-nowrap transition-all duration-200 ${
                active
                    ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5'
            }`}
        >
            {children}
        </button>
    );
}

function AlbumCard({ album, onPlay, formatPlays, compact = false }: {
    album: Album;
    onPlay: (id: string) => void;
    formatPlays: (n: number) => string;
    compact?: boolean;
}) {
    return (
        <div
            className="group cursor-pointer"
            onClick={() => onPlay(album.id)}
        >
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted ring-1 ring-border group-hover:ring-primary/40 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:-translate-y-1">
                <img
                    src={album.cover_url}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/40 scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play size={18} fill="currentColor" className="text-primary-foreground ml-0.5" />
                    </div>
                </div>
                {/* Plays badge */}
                {(album.total_plays ?? 0) > 0 && !compact && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur text-white text-[10px] font-bold">
                        {formatPlays(album.total_plays!)}
                    </div>
                )}
            </div>
            <div className="mt-2.5 space-y-0.5 px-0.5">
                <p className="font-semibold text-sm text-foreground truncate leading-tight">{album.title}</p>
                <p className="text-xs text-muted-foreground truncate">{album.artist.stage_name}</p>
                {!compact && (
                    <p className="text-[10px] font-bold text-primary/70 uppercase tracking-wide">{album.genre}</p>
                )}
            </div>
        </div>
    );
}

function TrackRow({ track, index, hovered, onHover, onPlay, formatPlays, formatDuration }: {
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
            className={`grid items-center gap-4 px-5 py-3 cursor-pointer transition-colors duration-150 ${hovered ? 'bg-muted/60' : 'hover:bg-muted/40'}`}
            style={{ gridTemplateColumns: '32px 1fr 80px 60px 36px' }}
            onMouseEnter={() => onHover(track.id)}
            onMouseLeave={() => onHover(null)}
            onClick={onPlay}
        >
            {/* Rank / play icon */}
            <div className="relative w-6 h-6 flex items-center justify-center">
                <span className={`absolute text-sm font-bold text-muted-foreground transition-opacity duration-150 ${hovered ? 'opacity-0' : 'opacity-100'}`}>
                    {index + 1}
                </span>
                <Play
                    size={14}
                    fill="currentColor"
                    className={`absolute text-primary transition-opacity duration-150 ${hovered ? 'opacity-100' : 'opacity-0'}`}
                />
            </div>

            {/* Track info */}
            <div className="flex items-center gap-3 min-w-0">
                <img
                    src={track.album.cover_url}
                    alt={track.album.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                        {track.album.artist.stage_name}
                        <span className="mx-1.5 opacity-40">·</span>
                        {track.album.title}
                    </p>
                </div>
            </div>

            {/* Plays */}
            <div className="flex items-center justify-end gap-1.5 text-sm text-muted-foreground">
                <TrendingUp size={11} className="text-primary opacity-70 shrink-0" />
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
                onClick={e => e.stopPropagation()}
            >
                <AddToPlaylistDialog
                    trackId={track.id}
                    trackTitle={track.title}
                    trigger={
                        <button className="w-7 h-7 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center text-muted-foreground transition-colors">
                            <ListMusic size={13} />
                        </button>
                    }
                />
            </div>
        </div>
    );
}
