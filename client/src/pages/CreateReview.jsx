import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateReview = ({ auth, games }) => {
  const [gameId, setGameId] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = window.localStorage.getItem("token");
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ game_id: gameId, content, rating })
    });

    if (response.ok) {
      navigate(`/games/${gameId}`);
    } else {
      // Handle error
      console.error('Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Review</h2>
      <select value={gameId} onChange={e => setGameId(e.target.value)} required>
        <option value="">Select a game</option>
        {games.map(game => (
          <option key={game.id} value={game.id}>{game.title}</option>
        ))}
      </select>
      <textarea 
        value={content} 
        onChange={e => setContent(e.target.value)} 
        required 
        placeholder="Write your review here"
      />
      <input 
        type="number" 
        min="1" 
        max="5" 
        value={rating} 
        onChange={e => setRating(Number(e.target.value))} 
        required
      />
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default CreateReview;