import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = ({ auth, setAuth }) => {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [newGame, setNewGame] = useState({
    title: '',
    description: '',
    release_date: '',
    category: '',
    image_url: ''
  });
  const [editReviewId, setEditReviewId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (auth.is_admin) {
      fetchUsers();
      fetchGames();
    }
    if (auth.id) {
      fetchMyReviews();
    }
  }, [auth.id, auth.is_admin]);

  const fetchMyReviews = async () => {
    if (!auth.id) return;
    try {
      const response = await fetch(`/api/reviews/user/${auth.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMyReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setMyReviews([]);
    }
  };

  const fetchAllReviews = async () => {
    try {
      const token = window.localStorage.getItem('token');
      const response = await fetch('/api/reviews', {
        headers: {
          'Authorization': token
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      setAllReviews([]);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = window.localStorage.getItem('token');
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      });

      if (response.ok) {
        fetchMyReviews();
        fetchAllReviews();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEditClick = (review) => {
    setEditReviewId(review.id);
    setEditContent(review.content);
    setEditRating(review.rating);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const token = window.localStorage.getItem("token");

    try {
      const response = await fetch(`/api/reviews/${editReviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ content: editContent, rating: editRating })
      });

      if (response.ok) {
        setEditReviewId(null);
        fetchMyReviews();
        fetchAllReviews();
      } else {
        setErrorMessage('Failed to update review');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  const renderStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleGameSubmit = async (e) => {
    e.preventDefault();
    const token = window.localStorage.getItem('token');

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(newGame)
      });

      if (response.ok) {
        const game = await response.json();
        setGames([...games, game]);
        setNewGame({
          title: '',
          description: '',
          release_date: '',
          category: '',
          image_url: ''
        });
        alert('Game added successfully!');
      } else {
        const error = await response.json();
        alert('Failed to add game: ' + error.message);
      }
    } catch (error) {
      console.error('Error adding game:', error);
      alert('Failed to add game');
    }
  };

  return (
    <div>
      <h2>Profile</h2>

      {/* User Information Section */}
      <div className="section">
        <h3>User Information</h3>
        <p>Username: {auth.username}</p>
        <p>Role: {auth.is_admin ? 'Administrator' : 'User'}</p>
        <input 
          type="text" 
          id="username"
          name="username"
          value={auth.username} 
          readOnly 
        />
      </div>

      {/* Reviews Section */}
      <div className="section">
        <h3>My Reviews</h3>
        {!Array.isArray(myReviews) ? (
          <p>Error loading reviews</p>
        ) : myReviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '20px',
            marginTop: '1rem' 
          }}>
            {myReviews.map(review => (
              <div key={review.id} style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <Link to={`/games/${review.game_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img 
                    src={review.game_image_url} 
                    alt={review.game_title}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                  <h4 style={{ margin: '10px 0' }}>{review.game_title}</h4>
                </Link>
                <div style={{ color: '#f8b400', marginBottom: '8px' }}>
                  {renderStars(review.rating)}
                </div>
                <p style={{ marginBottom: '15px' }}>{review.content}</p>
                <button
                  onClick={() => handleEditClick(review)}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    width: '100%'
                  }}
                >
                  Edit Review
                </button>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  style={{
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Delete Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {editReviewId && (
        <form onSubmit={handleUpdateSubmit}>
          <h3>Edit Review</h3>
          {errorMessage && <p className="error">{errorMessage}</p>}
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            required
          />
          <input
            type="number"
            min="1"
            max="5"
            value={editRating}
            onChange={e => setEditRating(Number(e.target.value))}
            required
          />
          <button type="submit">Update Review</button>
        </form>
      )}

      {/* Admin Section */}
      {auth.is_admin && (
        <div className="admin-section">
          <h3>Admin Dashboard</h3>

          {/* Users List */}
          <div>
            <h4>Users ({users.length})</h4>
            <ul>
              {users.map(user => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          </div>

          {/* Add Game Form */}
          <div style={{ marginTop: '2rem', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h4>Add New Game</h4>
            <form onSubmit={handleGameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Title*:
                </label>
                <input
                  id="title"
                  type="text"
                  value={newGame.title}
                  onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>

              <div>
                <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Description*:
                </label>
                <textarea
                  id="description"
                  value={newGame.description}
                  onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    height: '150px',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label htmlFor="release_date" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Release Date*:
                </label>
                <input
                  id="release_date"
                  type="date"
                  value={newGame.release_date}
                  onChange={(e) => setNewGame({ ...newGame, release_date: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>

              <div>
                <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Category*:
                </label>
                <input
                  id="category"
                  type="text"
                  value={newGame.category}
                  onChange={(e) => setNewGame({ ...newGame, category: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>

              <div>
                <label htmlFor="image_url" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Image URL*:
                </label>
                <input
                  id="image_url"
                  type="url"
                  value={newGame.image_url}
                  onChange={(e) => setNewGame({ ...newGame, image_url: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Add Game
              </button>
            </form>
          </div>

          {/* All Reviews Dropdown */}
          <div style={{ marginTop: '2rem' }}>
            <h4>All Reviews</h4>
            <button onClick={fetchAllReviews} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Load All Reviews
            </button>
            {allReviews.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '1rem' }}>
                {allReviews.map(review => (
                  <div key={review.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px' }}>
                    <Link to={`/games/${review.game_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h4>{review.game_title}</h4>
                    </Link>
                    <div style={{ color: '#f8b400', marginBottom: '8px' }}>
                      {renderStars(review.rating)}
                    </div>
                    <p>{review.content}</p>
                    <button onClick={() => handleEditClick(review)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', marginBottom: '8px', width: '100%' }}>
                      Edit Review
                    </button>
                    <button onClick={() => handleDeleteReview(review.id)} style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', width: '100%' }}>
                      Delete Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
