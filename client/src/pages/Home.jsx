import { Link } from "react-router-dom";

const GameRow = ({ games = [], title }) => {
  const renderStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  if (games.length === 0) {
    return null; // Don't render empty rows
  }

  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>{title}</h2>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "20px",
          padding: "10px 0",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {games.map((game) => (
          <Link
            key={game.id}
            to={`/games/${game.id}`}
            style={{
              flexShrink: 0,
              width: "250px",
              textDecoration: "none",
              color: "inherit",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <img
              src={game.image_url}
              alt={game.title}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <h3>{game.title}</h3>
            <div style={{ color: "#f8b400" }}>{renderStars(game.average_rating || 0)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Home = ({ games = [] }) => {
  // Sort games by average rating
  const topRatedGames = Array.isArray(games)
    ? [...games].sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0)).slice(0, 10)
    : [];

  const actionAdventureGames = Array.isArray(games)
    ? games.filter((game) => game.category?.toLowerCase() === "action-adventure")
    : [];

  const fpsGames = Array.isArray(games)
    ? games.filter((game) => game.category?.toLowerCase() === "fps")
    : [];

  const rpgGames = Array.isArray(games)
    ? games.filter((game) => game.category?.toLowerCase() === "rpg")
    : [];

  const sportsGames = Array.isArray(games)
    ? games.filter((game) => game.category?.toLowerCase() === "sports")
    : [];

  const strategyGames = Array.isArray(games)
    ? games.filter((game) => game.category?.toLowerCase() === "strategy")
    : [];

  return (
    <div style={{ padding: "20px" }}>
      <GameRow games={topRatedGames} title="Top Rated Games" />
      <GameRow games={actionAdventureGames} title="Action Adventure Games" />
      <GameRow games={fpsGames} title="FPS Games" />
      <GameRow games={rpgGames} title="RPG Games" />
      <GameRow games={sportsGames} title="Sports Games" />
      <GameRow games={strategyGames} title="Strategy Games" />
    </div>
  );
};

export default Home;
