import { useState, useEffect } from "react";
import { Link, Route, Routes, Navigate } from "react-router-dom";
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
          setAuth(json);
        } else {
          window.localStorage.removeItem("token");
        }
      } catch (error) {
        window.localStorage.removeItem("token");
      }
    }
  };

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games");
      if (!response.ok) {
        throw new Error("Failed to fetch games");
      }
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setAuth({});
  };

  return (
    <div className="app-container">
      <nav className="main-header">
        <div className="logo">
          <h1>GameSphere</h1>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/games">Games</Link></li>
          {auth.id ? (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={logout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home games={games} />} />
        <Route path="/games" element={<Games games={games} />} />
        <Route path="/games/:id" element={<GameDetails auth={auth} />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/register" element={<Register setAuth={setAuth} />} />
        <Route
          path="/profile"
          element={auth.id ? <Profile auth={auth} setAuth={setAuth} /> : <Navigate to="/login" />}
        />
      </Routes>

      <footer className="main-footer">
        <p>&copy; 2024 GameSphere. All rights reserved.</p>
        <ul className="footer-links">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
      </footer>
    </div>
  );
}

export default App;
