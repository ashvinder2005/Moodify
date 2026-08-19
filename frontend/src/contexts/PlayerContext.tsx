import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Song {
  _id: string;
  title: string;
  artist: string;
  duration: number;
  previewUrl: string;
  genre: string;
  moodTags: string[];
  imageUrl: string;
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  playSong: (song: Song, queue?: Song[]) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  progress: number;
  setProgress: (val: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // When the song changes, explicitly reload the audio source.
  // The HTML5 Audio spec requires a load() call when src changes on an
  // existing <audio> element — without it, play() fires on the old source.
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.load();
    }
  }, [currentSong]);

  // Separately control play / pause so that resuming never resets the track.
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Could not play audio", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const playSong = (song: Song, newQueue: Song[] = []) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(s => s._id === song._id);
      setQueueIndex(idx !== -1 ? idx : 0);
    }
  };

  const pauseSong = () => setIsPlaying(false);
  const resumeSong = () => setIsPlaying(true);

  const nextSong = () => {
    if (queueIndex < queue.length - 1) {
      const nextIdx = queueIndex + 1;
      setQueueIndex(nextIdx);
      setCurrentSong(queue[nextIdx]);
      setIsPlaying(true);
    }
  };

  const prevSong = () => {
    if (queueIndex > 0) {
      const prevIdx = queueIndex - 1;
      setQueueIndex(prevIdx);
      setCurrentSong(queue[prevIdx]);
      setIsPlaying(true);
    }
  };

  return (
    <PlayerContext.Provider value={{
      currentSong, isPlaying, queue, playSong, pauseSong, resumeSong, nextSong, prevSong, audioRef, progress, setProgress
    }}>
      {children}
      {currentSong && (
        <audio
          ref={audioRef as React.RefObject<HTMLAudioElement>}
          src={currentSong.previewUrl}
          onEnded={nextSong}
          onTimeUpdate={(e) => {
            if (audioRef.current) {
              setProgress((e.currentTarget.currentTime / audioRef.current.duration) * 100);
            }
          }}
        />
      )}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
