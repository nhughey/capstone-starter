import { useState, useEffect } from "react";
import { Link, Route, Routes, Navigate } from "react-router-dom";  // Add Navigate here
import Home from "./pages/Home";
import Games from "./pages/Games";
import GameDetails from "./pages/GameDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";



function App() {
  const [auth, setAuth] = useState({});
  const [games, setGames] = useState([]);

  useEffect(() => {
    attemptLoginWithToken();
    fetchGames();
  }, []);

  const attemptLoginWithToken = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch(`/api/auth/me`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const json = await response.json();
          console.log('User data:', json); // For debugging
          setAuth(json);
        } else {
          console.log('Failed to authenticate with token');
          window.localStorage.removeItem("token");
        }
      } catch (error) {
        console.error('Error during token authentication:', error);
        window.localStorage.removeItem("token");
      }
    }
  };

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      console.log('Fetched games:', data); // For debugging
      setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };


  const logout = () => {
    window.localStorage.removeItem("token");
    setAuth({});
  };

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/games">Games</Link>
        {auth.id ? (
          <>
            <Link to="/profile">Profile</Link>
            
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home games={games}/>} />
        <Route path="/games" element={<Games games={games} />} />
        <Route path="/games/:id" element={<GameDetails auth={auth} />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/register" element={<Register setAuth={setAuth} />} />
        <Route 
          path="/profile" 
          element={auth.id ? <Profile auth={auth} setAuth={setAuth} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
}

export default App;