import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from './src/models/Song';
import connectDB from './src/config/db';

dotenv.config();

const testSongs = [
  {
    title: 'Sunny Days',
    artist: 'Radiant Pop',
    duration: 210,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Pop',
    moodTags: ['Happy', 'Energetic'],
    imageUrl: 'https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?w=500&q=80'
  },
  {
    title: 'Midnight Rain',
    artist: 'Pensive Tones',
    duration: 185,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Acoustic',
    moodTags: ['Sad', 'Calm'],
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=500&q=80'
  },
  {
    title: 'Fire Inside',
    artist: 'Shatter Rock',
    duration: 195,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Rock',
    moodTags: ['Angry'],
    imageUrl: 'https://images.unsplash.com/photo-1497910091122-9f8a7746eb33?w=500&q=80'
  },
  {
    title: 'Ocean Breeze',
    artist: 'Zen Master',
    duration: 240,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Ambient',
    moodTags: ['Calm'],
    imageUrl: 'https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=500&q=80'
  },
  {
    title: 'Dance All Night',
    artist: 'DJ Pulse',
    duration: 200,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    genre: 'Pop',
    moodTags: ['Happy', 'Energetic'],
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80'
  },
  {
    title: 'Piano Dreams',
    artist: 'Serene Keys',
    duration: 260,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    genre: 'Classical',
    moodTags: ['Calm', 'Sad'],
    imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&q=80'
  },
  {
    title: 'Foggy Forest',
    artist: 'Nature\'s Cry',
    duration: 215,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    genre: 'Acoustic',
    moodTags: ['Sad'],
    imageUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=500&q=80'
  },
  {
    title: 'Metal Roar',
    artist: 'Iron Fury',
    duration: 175,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    genre: 'Rock',
    moodTags: ['Angry', 'Energetic'],
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80'
  },
  {
    title: 'Tropical Vibe',
    artist: 'Island Breeze',
    duration: 190,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    genre: 'Reggae',
    moodTags: ['Happy', 'Calm'],
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80'
  },
  {
    title: 'Night Drive',
    artist: 'Synthwave City',
    duration: 245,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    genre: 'Electronic',
    moodTags: ['Energetic', 'Angry'],
    imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&q=80'
  }
];

const seedData = async () => {
  try {
    await connectDB();
    await Song.deleteMany();
    await Song.insertMany(testSongs);
    console.log('Test songs imported successfully!');
    process.exit();
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`);
    process.exit(1);
  }
};

seedData();
