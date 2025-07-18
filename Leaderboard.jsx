import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = ({ timeTaken, userData }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format time for display
  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const playerScore = Math.floor((600 - timeTaken) * 1.5);
  const playerTime = formatTime(timeTaken);

  useEffect(() => {
    const sendScoreAndFetchLeaderboard = async () => {
      try {
        await fetch("https://webverse-game-backend-production.up.railway.app/api/leaderboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userData.name,
            department: userData.department,
            timeTaken: timeTaken,
            score: playerScore,
          }),
        });

        const response = await fetch("https://webverse-game-backend-production.up.railway.app/api/leaderboard");
        const data = await response.json();

        const updated = data.map(player => ({
          ...player,
          isCurrentPlayer: player.name === userData.name && player.score === playerScore
        }));

        setLeaderboard(updated);
        setLoading(false);
      } catch (err) {
        setError('Failed to load leaderboard data');
        setLoading(false);
        console.error('Error:', err);
      }
    };

    sendScoreAndFetchLeaderboard();
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
              key={`${player.rank}-${player.name}`}
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
          <p>Leaderboard shows all players. Lower completion time = higher rank</p>
        </div>

        <footer className="leaderboard-footer">
          World Wide Web Day Challenge © 2025
        </footer>
      </div>
    </div>
  );
};

export default Leaderboard;
