import { Braces, Check, Code2, Sparkles } from 'lucide-react';
import Logo from './Logo.jsx';
import Card from '../ui/Card.jsx';

function AuthScene({ className = '' }) {
  return (
    <div className={`auth-scene ${className}`} aria-hidden="true">
      <div className="auth-orbit auth-orbit-one" />
      <div className="auth-orbit auth-orbit-two" />
      <div className="auth-cube">
        <span className="auth-cube-face auth-cube-front"><Code2 /></span>
        <span className="auth-cube-face auth-cube-back"><Braces /></span>
        <span className="auth-cube-face auth-cube-right"><Sparkles /></span>
        <span className="auth-cube-face auth-cube-left"><Code2 /></span>
        <span className="auth-cube-face auth-cube-top"><Braces /></span>
        <span className="auth-cube-face auth-cube-bottom"><Sparkles /></span>
      </div>
      <span className="auth-scene-dot auth-scene-dot-one" />
      <span className="auth-scene-dot auth-scene-dot-two" />
    </div>
  );
}

/**
 * Mise en page commune aux écrans d'authentification :
 * panneau bleu à gauche (grand écran), carte de formulaire à droite.
 */
export default function AuthLayout({
  panelTitle,
  panelPoints = [],
  mainClassName = '',
  cardClassName = '',
  children,
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-[#378FE9] p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <AuthScene className="auth-scene-panel" />
        <div className="relative">
          <Logo light />
        </div>
        <div className="relative max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">{panelTitle}</h2>
          <ul className="mt-8 space-y-4">
            {panelPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-lg text-white/90">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/70">© 2026 DevOnDeck</p>
      </aside>

      <main className={`auth-main flex flex-col items-center justify-center px-4 py-10 ${mainClassName}`}>
        <AuthScene className="auth-scene-background" />
        <div className="relative z-10 mb-8 lg:hidden">
          <Logo />
        </div>
        <Card className={`auth-form-card relative z-10 w-full max-w-md p-8 sm:p-10 ${cardClassName}`}>
          {children}
        </Card>
      </main>
    </div>
  );
}
