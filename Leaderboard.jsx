import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = ({ timeTaken, userData }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format time taken (MM:SS)
  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  // Calculate player's score based on time taken
  const playerScore = Math.floor((600 - timeTaken) * 1.5);
  const playerTime = formatTime(timeTaken);

  // Fetch leaderboard data from backend
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('https://your-api.com/leaderboard');
        // const data = await response.json();
        
        // For now, we'll just show the current player
        const currentPlayer = { 
          id: 0, 
          name: userData.name, 
          department: userData.department,
          timeTaken: timeTaken,
          score: playerScore,
          isCurrentPlayer: true
        };
        
        setLeaderboard([{
          ...currentPlayer, 
          rank: 1,
          timeFormatted: playerTime
        }]);
        setLoading(false);
      } catch (err) {
        setError('Failed to load leaderboard data');
        setLoading(false);
        console.error('Error fetching leaderboard:', err);
      }
    };

    fetchLeaderboard();
  }, [timeTaken, userData, playerScore, playerTime]);

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-card">
          <h1 className="leaderboard-title">🏆 TOP PLAYERS LEADERBOARD</h1>
          <div className="loading-message">Loading leaderboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-card">
          <h1 className="leaderboard-title">🏆 TOP PLAYERS LEADERBOARD</h1>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <h1 className="leaderboard-title">🏆 TOP PLAYERS LEADERBOARD</h1>
        
        <div className="player-result">
          <div className="result-label">Player:</div>
          <div className="result-value">{userData.name}</div>
          
          <div className="result-label">Department:</div>
          <div className="result-value">{userData.department}</div>
          
          <div className="result-label">Completion Time:</div>
          <div className="result-value">{playerTime}</div>
          
          <div className="result-label">Your Score:</div>
          <div className="result-value">{playerScore}</div>
        </div>
        
        <div className="leaderboard-header">
          <div className="leaderboard-rank">Rank</div>
          <div className="leaderboard-name">Player</div>
          <div className="leaderboard-department">Department</div>
          <div className="leaderboard-time">Time</div>
          <div className="leaderboard-score">Score</div>
        </div>
        
        <div className="leaderboard-list">
          {leaderboard.map(player => (
            <div 
              key={player.id} 
              className={`leaderboard-player ${player.isCurrentPlayer ? 'current-player' : ''}`}
            >
              <div className="leaderboard-rank">{player.rank}</div>
              <div className="leaderboard-name">{player.name}</div>
              <div className="leaderboard-department">{player.department || '-'}</div>
              <div className="leaderboard-time">{player.timeFormatted}</div>
              <div className="leaderboard-score">{player.score}</div>
            </div>
          ))}
        </div>
        
        <div className="backend-note">
          <p>Leaderboard will display all players once backend is implemented</p>
          <p>Players will be ranked by completion time (lower time = higher rank)</p>
        </div>
        
        <footer className="leaderboard-footer">
          World Wide Web Day Challenge © 2025
        </footer>
      </div>
    </div>
  );
};

export default Leaderboard;