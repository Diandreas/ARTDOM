
import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

export type Track = {
    id: string;
    title: string;
    artist: string;
    image: string;
    url: string; // URL to audio file
    duration?: number;
    album?: string;
    is_favorited?: boolean;
};

export type RepeatMode = 'off' | 'one' | 'all';

interface AudioContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    togglePlay: () => void;
    playTrack: (track: Track) => void;
    progress: number;
    duration: number;
    seek: (time: number) => void;
    // Advanced features
    queue: Track[];
    setQueue: (tracks: Track[], startIndex?: number, autoplay?: boolean) => void;
    addToQueue: (track: Track) => void;
    next: () => void;
    previous: () => void;
    repeatMode: RepeatMode;
    toggleRepeat: () => void;
    isShuffled: boolean;
    toggleShuffle: () => void;
    volume: number;
    setVolume: (volume: number) => void;
    isMuted: boolean;
    toggleMute: () => void;
    clearQueue: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [queue, setQueueState] = useState<Track[]>([]);
    const [originalQueue, setOriginalQueue] = useState<Track[]>([]);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
    const [isShuffled, setIsShuffled] = useState(false);
    const [volume, setVolumeState] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lastLoadedUrlRef = useRef<string | null>(null);

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.volume = volume;
        audioRef.current.preload = 'metadata'; // Only load metadata, not entire file

        const audio = audioRef.current;

        const updateProgress = () => {
            setProgress(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        const handleEnded = () => {
            // Auto-play next track based on repeat mode
            if (repeatMode === 'one') {
                audio.currentTime = 0;
                audio.play();
            } else {
                next();
            }
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('loadedmetadata', updateProgress);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('loadedmetadata', updateProgress);
            audio.pause();
        };
    }, []);

    // Handle repeat mode changes for auto-play
    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        const handleEnded = () => {
            if (repeatMode === 'one') {
                audio.currentTime = 0;
                audio.play();
            } else {
                next();
            }
        };

        audio.removeEventListener('ended', handleEnded);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('ended', handleEnded);
        };
    }, [repeatMode, queue, currentTrack]);

    useEffect(() => {
        if (currentTrack && audioRef.current) {
            const audio = audioRef.current;

            // Only reload if the URL has actually changed
            if (lastLoadedUrlRef.current !== currentTrack.url) {
                audio.src = currentTrack.url;
                audio.load();
                lastLoadedUrlRef.current = currentTrack.url;
            }

            if (isPlaying) {
                audio.play().catch(e => console.error("Playback failed", e));
            } else {
                audio.pause();
            }
        }
    }, [currentTrack, isPlaying]);

    const togglePlay = () => {
        if (!currentTrack) return;
        setIsPlaying(!isPlaying);
    };

    const playTrack = (track: Track) => {
        if (currentTrack?.id === track.id) {
            togglePlay();
        } else {
            setCurrentTrack(track);
            setIsPlaying(true);
        }
    };

    const seek = (time: number) => {
        if (audioRef.current && !isNaN(time) && isFinite(time)) {
            audioRef.current.currentTime = Math.max(0, Math.min(time, audioRef.current.duration || 0));
        }
    };

    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const setQueue = useCallback((tracks: Track[], startIndex: number = 0, autoplay: boolean = true) => {
        setQueueState(tracks);
        setOriginalQueue(tracks);
        setIsShuffled(false);

        const startTrack = tracks[startIndex];
        if (startTrack) {
            setCurrentTrack(startTrack);
            setIsPlaying(autoplay);
        }
    }, []);

    const addToQueue = useCallback((track: Track) => {
        setQueueState(prev => [...prev, track]);
        setOriginalQueue(prev => [...prev, track]);
    }, []);

    const next = useCallback(() => {
        if (queue.length === 0) {
            setIsPlaying(false);
            return;
        }

        const currentIndex = currentTrack
            ? queue.findIndex(t => t.id === currentTrack.id)
            : -1;

        let nextIndex = currentIndex + 1;

        if (nextIndex >= queue.length) {
            // End of queue
            if (repeatMode === 'all') {
                nextIndex = 0; // Loop back to start
            } else {
                // Stop playback
                setIsPlaying(false);
                return;
            }
        }

        const nextTrack = queue[nextIndex];
        if (nextTrack) {
            setCurrentTrack(nextTrack);
            setIsPlaying(true);
        }
    }, [queue, currentTrack, repeatMode]);

    const previous = useCallback(() => {
        if (queue.length === 0) return;

        // If more than 3 seconds into track, restart current track
        if (audioRef.current && audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0;
            return;
        }

        const currentIndex = currentTrack
            ? queue.findIndex(t => t.id === currentTrack.id)
            : 0;

        let prevIndex = currentIndex - 1;

        if (prevIndex < 0) {
            // At start of queue
            if (repeatMode === 'all') {
                prevIndex = queue.length - 1; // Loop to end
            } else {
                prevIndex = 0; // Stay at first track
            }
        }

        const prevTrack = queue[prevIndex];
        if (prevTrack) {
            setCurrentTrack(prevTrack);
            setIsPlaying(true);
        }
    }, [queue, currentTrack, repeatMode]);

    const toggleRepeat = useCallback(() => {
        const modes: RepeatMode[] = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(repeatMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        setRepeatMode(nextMode);
    }, [repeatMode]);

    const toggleShuffle = useCallback(() => {
        if (isShuffled) {
            // Turn off shuffle - restore original queue
            setQueueState(originalQueue);
            setIsShuffled(false);
        } else {
            // Turn on shuffle
            let shuffledQueue = shuffleArray(queue);

            // Ensure current track stays first if playing
            if (currentTrack) {
                shuffledQueue = shuffledQueue.filter(t => t.id !== currentTrack.id);
                shuffledQueue.unshift(currentTrack);
            }

            setQueueState(shuffledQueue);
            setIsShuffled(true);
        }
    }, [isShuffled, queue, originalQueue, currentTrack]);

    const setVolume = useCallback((newVolume: number) => {
        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        setVolumeState(clampedVolume);

        if (audioRef.current) {
            audioRef.current.volume = clampedVolume;
        }

        setIsMuted(clampedVolume === 0);
    }, []);

    const toggleMute = useCallback(() => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.volume = volume;
                audioRef.current.muted = false;
                setIsMuted(false);
            } else {
                audioRef.current.muted = true;
                setIsMuted(true);
            }
        }
    }, [isMuted, volume]);

    const clearQueue = useCallback(() => {
        setQueueState([]);
        setOriginalQueue([]);
        setCurrentTrack(null);
        setIsPlaying(false);
    }, []);

    return (
        <AudioContext.Provider value={{
            currentTrack,
            isPlaying,
            togglePlay,
            playTrack,
            progress,
            duration,
            seek,
            queue,
            setQueue,
            addToQueue,
            next,
            previous,
            repeatMode,
            toggleRepeat,
            isShuffled,
            toggleShuffle,
            volume,
            setVolume,
            isMuted,
            toggleMute,
            clearQueue,
        }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}
