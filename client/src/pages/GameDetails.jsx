import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const GameDetails = ({ auth }) => {
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();

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

  const deleteReview = async (reviewId) => {
    const token = window.localStorage.getItem("token");
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
    });
    if (response.ok) {
      setReviews(reviews.filter(review => review.id !== reviewId));
    }
  };

  if (!game) return <div>Loading...</div>;

  return (
    <div>
      <h2>{game.title}</h2>
      <p>{game.description}</p>
      <h3>Reviews</h3>
      {auth.id && <Link to={`/create-review/${id}`}>Add Review</Link>}
      {reviews.map(review => (
        <div key={review.id}>
          <p>{review.content}</p>
          <p>Rating: {review.rating}/5</p>
          {auth.id === review.user_id && (
            <>
              <Link to={`/edit-review/${review.id}`}>Edit</Link>
              <button onClick={() => deleteReview(review.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default GameDetails;