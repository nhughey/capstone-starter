import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchGames();
    fetchUsers();
  }, []);

  const fetchGames = async () => {
    const response = await fetch('/api/games');
    const data = await response.json();
    setGames(data);
  };

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  const deleteGame = async (id) => {
    const token = window.localStorage.getItem("token");
    const response = await fetch(`/api/games/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
    });
    if (response.ok) {
      setGames(games.filter(game => game.id !== id));
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Games</h3>
      <ul>
        {games.map(game => (
          <li key={game.id}>
            {game.title}
            <button onClick={() => deleteGame(game.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>Users</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;