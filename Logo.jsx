import { Link } from 'react-router-dom';

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5" aria-label="DevOnDeck, accueil">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg font-extrabold ${
          light ? 'bg-white text-brand' : 'bg-brand text-white'
        }`}
      >
        D
      </span>
      <span className={`text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
        DevOn<span className={light ? 'text-white/80' : 'text-brand'}>Deck</span>
      </span>
    </Link>
  );
}
