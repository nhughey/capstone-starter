import { useState, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
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
      const response = await fetch(`/api/auth/me`, {
        headers: {
          authorization: token,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setAuth(json);
      } else {
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
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games games={games} />} />
        <Route path="/games/:id" element={<GameDetails auth={auth} />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/register" element={<Register setAuth={setAuth} />} />
        <Route path="/profile" element={<Profile auth={auth} setAuth={setAuth} />} />
      </Routes>
    </div>
  );
}

export default App;