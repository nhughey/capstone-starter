import { Link } from 'react-router-dom';

   const Games = ({ games }) => {
     console.log('Games in component:', games);  // Add this line
     return (
       <div>
         <h2>Games</h2>
         {games.length === 0 ? (
           <p>No games available.</p>
         ) : (
           <ul>
             {games.map(game => (
               <li key={game.id}>
                 <Link to={`/games/${game.id}`}>{game.title}</Link>
               </li>
             ))}
           </ul>
         )}
       </div>
     );
   };

   export default Games;
   