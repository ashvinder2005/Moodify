import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Chart as ChartJS, 
  registerables
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { Clock, Music, Zap, TrendingUp } from 'lucide-react';

ChartJS.register(...registerables);

const Analytics: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/moods/analytics')
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <div style={{ padding: '40px', color: 'var(--text-secondary)' }}>Loading analytics...</div>;

  const formatHour = (hour: number | null) => {
    if (hour === null) return 'N/A';
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h}:00 ${ampm}`;
  };

  // Prepare Doughnut Chart Data
  const counts = data.counts || [];
  const doughnutData = {
    labels: counts.map((c: any) => c._id),
    datasets: [{
      data: counts.map((c: any) => c.count),
      backgroundColor: [
        'rgba(255, 75, 130, 0.8)', // Happy/Pinkish
        'rgba(0, 230, 230, 0.8)', // Calm/Cyan
        'rgba(170, 0, 255, 0.8)', // Angry/Purple
        'rgba(255, 206, 86, 0.8)', // Sad/Yellow
      ],
      hoverOffset: 10,
      borderWidth: 0,
    }]
  };

  // Prepare Line Chart Data
  const trends = data.trends || [];
  const dates = Array.from(new Set(trends.map((t: any) => t._id?.date))).filter(Boolean).sort() as string[];
  const moods = ['Happy', 'Sad', 'Angry', 'Calm'];
  const colors: Record<string, string> = { 
    Happy: 'rgba(255, 75, 130, 1)', 
    Sad: 'rgba(255, 206, 86, 1)', 
    Angry: 'rgba(170, 0, 255, 1)', 
    Calm: 'rgba(0, 230, 230, 1)' 
  };

  const lineData = {
    labels: dates.map(d => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric' })),
    datasets: moods.map(mood => {
      const dataPoints = dates.map(date => {
        const trend = trends.find((t: any) => t._id?.date === date && t._id?.mood === mood);
        return trend ? trend.count : 0;
      });
      return {
        label: mood,
        data: dataPoints,
        borderColor: colors[mood],
        backgroundColor: colors[mood].replace('1)', '0.2)'),
        tension: 0.4,
        fill: true,
      };
    })
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#a6accd', font: { family: 'Inter' } }
      }
    },
    scales: {
      y: { 
        ticks: { color: '#a6accd' }, 
        grid: { color: 'rgba(255,255,255,0.05)' } 
      },
      x: { 
        ticks: { color: '#a6accd' }, 
        grid: { display: false } 
      }
    }
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px' }}>Deep Insights</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Analysis of your emotional patterns and listening habits.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255, 75, 130, 0.1)' }}><Zap size={24} color="rgba(255, 75, 130, 1)" /></div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Most Frequent</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{data.mostFrequent}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(0, 230, 230, 0.1)' }}><Clock size={24} color="rgba(0, 230, 230, 1)" /></div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Peak Activity</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatHour(data.topHour)}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(170, 0, 255, 0.1)' }}><Music size={24} color="rgba(170, 0, 255, 1)" /></div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Top Genre</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{data.genrePerMood.length > 0 ? data.genrePerMood[0].topGenre : 'N/A'}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255, 206, 86, 0.1)' }}><TrendingUp size={24} color="rgba(255, 206, 86, 1)" /></div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Logs Today</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {(data.recent || []).filter((l: any) => new Date(l.timestamp).toDateString() === new Date().toDateString()).length}
            </h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '24px' }}>Mood Distribution</h3>
          <div style={{ flex: 1, position: 'relative' }}>
            <Doughnut data={doughnutData} options={{ ...chartOptions, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '24px' }}>Emotional Trends</h3>
          <div style={{ flex: 1, position: 'relative' }}>
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Recent Emotional Activity</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {(data.recent || []).map((log: any) => (
            <div key={log._id} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, color: colors[log.mood] || '#fff' }}>{log.mood}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleString()}</span>
              </div>
              {log.textInput && <p style={{ fontSize: '0.9rem', color: '#ccc', fontStyle: 'italic' }}>"{log.textInput}"</p>}
              <div style={{ marginTop: '8px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${((log.intensity || 0) / 5) * 100}%`, background: colors[log.mood] || '#fff' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
