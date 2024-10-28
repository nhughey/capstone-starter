import { useState } from 'react';
import { Link } from 'react-router-dom';

const Games = ({ games }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to render stars
  const renderStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredGames.map(game => (
          <Link 
            key={game.id} 
            to={`/games/${game.id}`}
            style={{ 
              textDecoration: 'none', 
              color: 'inherit',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img 
              src={game.image_url} 
              alt={game.title}
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
            <h3>{game.title}</h3>
            <div style={{ color: '#f8b400' }}>
              {renderStars(game.average_rating || 0)}
            </div>
            <p>{game.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Games;