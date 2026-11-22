import Logo from './Logo.jsx';

const columns = [
  { title: 'Plateforme', items: ['À propos', 'Fonctionnalités', 'Comment ça marche'] },
  { title: 'Assistance', items: ['Centre d’aide', 'Contact', 'Signaler un problème'] },
  { title: 'Légal', items: ['Mentions légales', 'Confidentialité', 'Conditions d’utilisation'] },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-[1128px] gap-10 px-4 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            La plateforme qui met en relation développeurs et organisations selon leurs
            compétences techniques.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-bold text-ink">{col.title}</h3>
            <ul className="mt-4 space-y-3">
              {col.items.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted transition hover:text-brand">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1128px] flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-muted sm:flex-row">
          <p>© 2026 DevOnDeck. Tous droits réservés.</p>
          <p>Français</p>
        </div>
      </div>
    </footer>
  );
}
