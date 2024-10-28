import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GameDetails = ({ auth }) => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    content: ''
  });

  useEffect(() => {
    fetchGame();
    fetchReviews();
  }, [id]);

  const fetchGame = async () => {
    const response = await fetch(`/api/games/${id}`);
    const data = await response.json();
    setGame(data);
  };

  const fetchReviews = async () => {
    const response = await fetch(`/api/reviews/game/${id}`);
    const data = await response.json();
    setReviews(data);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = window.localStorage.getItem('token');
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          game_id: id,
          ...newReview
        })
      });
      
      if (response.ok) {
        setNewReview({ rating: 5, content: '' });
        fetchReviews(); // Refresh reviews after posting
      }
    } catch (error) {
      console.error('Error posting review:', error);
    }
  };

  if (!game) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <img 
        src={game.image_url} 
        alt={game.title}
        style={{
          width: '100%',
          maxHeight: '400px',
          objectFit: 'cover',
          borderRadius: '8px'
        }}
      />
      <h1>{game.title}</h1>
      <p>{game.description}</p>
      <p><strong>Category:</strong> {game.category}</p>
      <p><strong>Release Date:</strong> {new Date(game.release_date).toLocaleDateString()}</p>

      <div style={{ marginTop: '40px' }}>
        <h2>Reviews</h2>
        {auth.id && (
          <form onSubmit={handleReviewSubmit} style={{ marginBottom: '20px' }}>
            <div>
              <label>Rating: </label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
              >
                {[5,4,3,2,1].map(num => (
                  <option key={num} value={num}>{num} stars</option>
                ))}
              </select>
            </div>
            <div>
              <textarea
                value={newReview.content}
                onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                placeholder="Write your review here..."
                required
                style={{ width: '100%', minHeight: '100px', marginTop: '10px' }}
              />
            </div>
            <button type="submit" style={{ marginTop: '10px' }}>Submit Review</button>
          </form>
        )}

        <div>
          {reviews.map(review => (
            <div key={review.id} style={{ 
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '10px',
              marginBottom: '10px'
            }}>
              <p><strong>{review.username}</strong> - {review.rating} stars</p>
              <p>{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameDetails;