import { useState } from 'react';

const Profile = ({ auth, setAuth }) => {
  const [username, setUsername] = useState(auth.username);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = window.localStorage.getItem('token');
    const response = await fetch(`/api/users/${auth.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ username })
    });
    const data = await response.json();
    if (response.ok) {
      setAuth({...auth, username: data.username});
    } else {
      // Handle update error
      console.error(data.error);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;