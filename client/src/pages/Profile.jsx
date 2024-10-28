import { useState, useEffect } from 'react';

const Profile = ({ auth, setAuth }) => {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [newGame, setNewGame] = useState({
    title: '',
    description: '',
    release_date: '',
    category: '',
    image_url: ''
  });

  useEffect(() => {
    console.log('Auth in Profile:', auth);
    console.log('Is admin?', auth.is_admin);
    if (auth.is_admin) {
      fetchUsers();
      fetchGames();
    }
  }, [auth.is_admin]);

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
        {myReviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <ul>
            {myReviews.map(review => (
              <li key={review.id}>{review.content}</li>
            ))}
          </ul>
        )}
      </div>

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
        </div>
      )}
    </div>
  );
};

export default Profile;