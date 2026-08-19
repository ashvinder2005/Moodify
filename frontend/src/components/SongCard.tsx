import React from 'react';
import { Play } from 'lucide-react';
import api from '../api/axios';
import { usePlayer } from '../contexts/PlayerContext';
import type { Song } from '../contexts/PlayerContext';

interface SongCardProps {
  song: Song;
  queue: Song[];
  compact?: boolean;
}

const SongCard: React.FC<SongCardProps> = ({ song, queue, compact }) => {
  const { playSong } = usePlayer();

  const handlePlay = () => {
    playSong(song, queue);
    api.post('/history', { song }).catch(console.error);
  };

  return (
    <div 
      className="glass-panel" 
      style={{ 
        padding: compact ? '12px' : '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: compact ? '8px' : '12px', 
        cursor: 'pointer', 
        transition: 'transform 0.2s', 
        minWidth: compact ? '140px' : '180px',
        maxWidth: compact ? '140px' : 'none'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      onClick={handlePlay}
    >
      <div style={{ width: '100%', aspectRatio: '1', borderRadius: '8px', background: 'var(--bg-glass)', position: 'relative', overflow: 'hidden' }}>
        {song.imageUrl ? (
          <img src={song.imageUrl} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Play size={compact ? 24 : 40} color="var(--text-secondary)" opacity={0.5} />
          </div>
        )}
        <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'var(--accent-primary)', width: compact ? '24px' : '30px', height: compact ? '24px' : '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
          <Play size={compact ? 12 : 16} fill="#fff" style={{ marginLeft: '1px' }} />
        </div>
      </div>
      <div>
        <h4 style={{ fontWeight: 600, fontSize: compact ? '0.85rem' : '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: compact ? '0.75rem' : '0.8rem' }}>{song.artist}</p>
      </div>
    </div>
  );
};

export default SongCard;
