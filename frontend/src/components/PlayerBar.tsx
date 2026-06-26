import React, { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';

const PlayerBar: React.FC = () => {
  const { currentSong, isPlaying, pauseSong, resumeSong, nextSong, prevSong, progress, setProgress, audioRef } = usePlayer();
  const [volume, setVolume] = useState(1);

  if (!currentSong) return null;

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value) / 100;
    setVolume(vol);
    if (audioRef?.current) {
      audioRef.current.volume = vol;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    if (audioRef?.current) {
       audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '90px',
      background: 'rgba(15, 17, 26, 0.85)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      zIndex: 100,
      justifyContent: 'space-between'
    }}>
      {/* Song Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '30%' }}>
        {currentSong.imageUrl ? (
           <img src={currentSong.imageUrl} alt={currentSong.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
        ) : (
           <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Music size={24} color="var(--text-secondary)" />
           </div>
        )}
        <div style={{ overflow: 'hidden' }}>
          <h4 style={{ fontWeight: 600, fontSize: '1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentSong.title}</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{currentSong.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '40%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button onClick={prevSong} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><SkipBack size={20} /></button>
          
          <button 
            onClick={isPlaying ? pauseSong : resumeSong}
            style={{ 
              width: '40px', height: '40px', borderRadius: '50%', background: '#fff', color: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause size={20} fill="#000" /> : <Play size={20} fill="#000" style={{ marginLeft: '4px' }} />}
          </button>

          <button onClick={nextSong} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><SkipForward size={20} /></button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span>{audioRef?.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
          <input 
            type="range" 
            min="0" max="100" 
            value={progress || 0}
            onChange={handleSeek}
            style={{ 
              flex: 1, height: '4px', appearance: 'none', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', outline: 'none'
            }} 
          />
          <span>{audioRef?.current && audioRef.current.duration && !isNaN(audioRef.current.duration) ? formatTime(audioRef.current.duration) : (currentSong.duration ? formatTime(currentSong.duration) : '0:00')}</span>
        </div>
      </div>

      {/* Volume / Extras */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', width: '30%' }}>
         <Volume2 size={20} color="var(--text-secondary)" />
         <input 
            type="range" 
            min="0" max="100" 
            value={volume * 100}
            onChange={handleVolume}
            style={{ width: '80px', height: '4px', appearance: 'none', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', outline: 'none' }} 
         />
      </div>
    </div>
  );
};

export default PlayerBar;
