import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import { buttonClasses } from '../ui/Button.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const links = [
  { label: 'Fonctionnalités', hash: '#fonctionnalites' },
  { label: 'Comment ça marche', hash: '#comment-ca-marche' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1128px] items-center justify-between px-4">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
          {links.map((l) => (
            <Link
              key={l.hash}
              to={{ pathname: '/', hash: l.hash }}
              className="text-sm font-semibold text-muted transition hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session?.role === 'ORGANISATION' ? (
            <Link to="/organisation/offres" className={buttonClasses('primary', '!px-5 !py-2 !text-sm')}>
              Mes offres
            </Link>
          ) : (
            <>
          <Link
            to="/developpeur/connexion"
            className={buttonClasses('outline', '!px-5 !py-2 !text-sm')}
          >
            Se connecter
          </Link>
          <Link
            to="/developpeur/inscription"
            className={buttonClasses('primary', '!px-5 !py-2 !text-sm')}
          >
            S’inscrire
          </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-ink hover:bg-black/5 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col py-2" aria-label="Navigation mobile">
            {links.map((l) => (
              <Link
                key={l.hash}
                to={{ pathname: '/', hash: l.hash }}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-semibold text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            {session?.role === 'ORGANISATION' ? (
              <Link to="/organisation/offres" onClick={() => setOpen(false)} className={buttonClasses('primary')}>
                Mes offres
              </Link>
            ) : (
              <>
                <Link to="/developpeur/connexion" className={buttonClasses('outline')}>
                  Se connecter
                </Link>
                <Link to="/developpeur/inscription" className={buttonClasses('primary')}>
                  S’inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
