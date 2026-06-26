import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import type { Song } from '../contexts/PlayerContext';
import SongCard from '../components/SongCard';

const MOODS = ['Happy', 'Sad', 'Angry', 'Calm'];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [personalizedSongs, setPersonalizedSongs] = useState<Song[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [textMood, setTextMood] = useState('');
  const [intensity, setIntensity] = useState<number>(3);
  
  const hour = new Date().getHours();
  let greeting = 'Good Evening';
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 18) greeting = 'Good Afternoon';

  useEffect(() => {
    fetchPersonalData();
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [selectedMood, intensity]);

  const fetchPersonalData = async () => {
    try {
      const [recentRes, personalRes] = await Promise.all([
        api.get('/music/recently-played'),
        api.get('/music/personalized')
      ]);
      setRecentlyPlayed(recentRes.data);
      setPersonalizedSongs(personalRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const query = selectedMood ? `?mood=${selectedMood}&intensity=${intensity}` : `?intensity=${intensity}`;
      const res = await api.get(`/music/recommendations${query}`);
      setSongs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoodClick = async (m: string) => {
    setSelectedMood(m);
    try {
      await api.post('/moods/log', { mood: m, intensity });
      // Refresh personalized data after mood change
      fetchPersonalData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textMood.trim()) return;
    try {
      const logRes = await api.post('/moods/log', { textInput: textMood, intensity });
      setSelectedMood(logRes.data.mood);
      if (logRes.data.intensity) {
         setIntensity(logRes.data.intensity);
      }
      setTextMood('');
      fetchPersonalData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px' }}>{greeting}, {user?.name.split(' ')[0]}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>How are you feeling right now?</p>
      </div>

      {recentlyPlayed.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px' }}>Recently Played</h2>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
            {recentlyPlayed.map(song => (
              <SongCard key={song._id} song={song} queue={recentlyPlayed} compact />
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Select Mood</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {MOODS.map(m => (
              <button 
                key={m} 
                onClick={() => handleMoodClick(m)}
                className={`btn ${selectedMood === m ? 'btn-primary' : 'btn-glass'}`}
              >
                {m}
              </button>
            ))}
          </div>
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Intensity: {intensity}</label>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                {intensity === 1 && 'Slightly'}
                {intensity === 3 && 'Moderately'}
                {intensity === 5 && 'Extremely'}
              </span>
            </div>
            <input 
              type="range" 
              min="1" max="5" 
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              style={{ width: '100%', appearance: 'none', background: 'rgba(255,255,255,0.1)', height: '4px', borderRadius: '2px', outline: 'none' }}
            />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Or tell us about your day</h3>
          <form onSubmit={handleTextSubmit} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              className="input-glass" 
              placeholder="e.g. I had a rough meeting..."
              value={textMood}
              onChange={(e) => setTextMood(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Detect</button>
          </form>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '20px' }}>
          {selectedMood ? `${selectedMood} Vibes` : 'Smart Recommendations'}
        </h2>
        
        {songs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No songs found right now.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {songs.map(song => (
              <SongCard key={song._id} song={song} queue={songs} />
            ))}
          </div>
        )}
      </div>

      {personalizedSongs.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '20px' }}>Recommended for You</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {personalizedSongs.map(song => (
              <SongCard key={song._id} song={song} queue={personalizedSongs} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
