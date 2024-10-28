import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateReview = ({ auth, games }) => {
  const [gameId, setGameId] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [errorMessage, setErrorMessage] = useState(''); // State to handle error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = window.localStorage.getItem("token");
    
    try {
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
      } else if (response.status === 400) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'You have already reviewed this game.');
      } else {
        setErrorMessage('Failed to submit review. Please try again later.');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Review</h2>
      {errorMessage && <p className="error">{errorMessage}</p>} {/* Display error message */}
      <label htmlFor="gameSelect">Select a game</label>
      <select 
        id="gameSelect" 
        value={gameId} 
        onChange={e => setGameId(e.target.value)} 
        required
      >
        <option value="">Select a game</option>
        {games.map(game => (
          <option key={game.id} value={game.id}>{game.title}</option>
        ))}
      </select>

      <label htmlFor="reviewContent">Review</label>
      <textarea
        id="reviewContent"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        placeholder="Write your review here"
      />

      <label htmlFor="ratingInput">Rating (1-5)</label>
      <input
        id="ratingInput"
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
};

export default CreateReview;
