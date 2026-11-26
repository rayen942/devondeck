import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  MessageSquare,
  Percent,
  Rocket,
  Search,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import Card from '../components/ui/Card.jsx';
import { buttonClasses } from '../components/ui/Button.jsx';

const benefits = [
  {
    icon: Layers,
    title: 'Un profil structuré',
    text: 'Vos cinq langages principaux, vos frameworks et vos bibliothèques, présentés de façon claire et comparable.',
  },
  {
    icon: Percent,
    title: 'Un matching automatique',
    text: 'Les compétences d’un profil sont comparées à celles d’une offre : un pourcentage de correspondance s’affiche.',
  },
  {
    icon: MessageSquare,
    title: 'Un contact direct',
    text: 'Les organisations écrivent directement aux candidats par message ou notification, sans intermédiaire.',
  },
];

const steps = [
  { icon: UserPlus, title: 'Créez votre profil', text: 'Inscrivez-vous et renseignez vos langages, compétences et biographie.' },
  { icon: Search, title: 'Soyez repéré', text: 'Les organisations recherchent et filtrent les développeurs par compétences.' },
  { icon: Rocket, title: 'Recevez des opportunités', text: 'Consultez vos messages et suivez vos candidatures depuis le web ou le mobile.' },
];

const skills = ['React', 'Spring Boot', 'PostgreSQL', 'Flutter', 'Java'];

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Accroche */}
        <section className="bg-gradient-to-b from-brand-soft to-canvas">
          <div className="mx-auto grid max-w-[1128px] items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand shadow-sm">
                Web et mobile
              </p>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Trouvez les développeurs qui correspondent à vos besoins, ou l’opportunité qui
                vous correspond.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                DevOnDeck met en relation développeurs et organisations selon leurs compétences
                techniques, avec un pourcentage de correspondance calculé automatiquement.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/developpeur/inscription" className={buttonClasses('primary')}>
                  Je suis développeur
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link to="/organisation/inscription" className={buttonClasses('outline')}>
                  Je suis une organisation
                </Link>
              </div>
            </div>

            {/* Illustration : carte profil + badge de matching */}
            <div className="developer-card-stage relative mx-auto mb-12 w-full max-w-md" aria-hidden="true">
              <Card className="developer-profile-card relative p-6">
                <div className="developer-card-cover relative -mx-6 -mt-6 mb-5 h-28 overflow-hidden rounded-t-2xl bg-gradient-to-br from-brand-dark via-brand to-[#48B4E8]">
                  <span className="developer-cover-orb developer-cover-orb-one" />
                  <span className="developer-cover-orb developer-cover-orb-two" />
                  <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" />
                    Profil en vedette
                  </span>
                  <div className="absolute bottom-4 left-5 flex items-center gap-2 text-white/85">
                    <span className="h-px w-8 bg-white/70" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">DevOnDeck talent</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="developer-avatar flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-[#48B4E8] text-sm font-extrabold tracking-wider text-white shadow-lg">
                    DEV
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-extrabold">Développeur</p>
                    <p className="text-sm text-muted">Full Stack · Disponible</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-brand/10 bg-brand-soft px-3 py-1 text-sm font-semibold text-brand"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-6 rounded-xl bg-canvas/70 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                    <span className="text-muted">Correspondance avec l’offre</span>
                    <span className="text-base font-extrabold text-green-700">87 %</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div className="developer-match-bar h-full w-[87%] rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
                  </div>
                  <p className="mt-2 text-xs font-medium text-muted">Compétences très proches de votre offre</p>
                </div>
              </Card>
              <Card className="developer-message-card absolute -bottom-10 right-0 flex items-center gap-3 px-4 py-3 sm:-right-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <MessageSquare className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">Nouveau message</p>
                  <p className="text-xs text-muted">Une organisation vous a contacté</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Bénéfices */}
        <section id="fonctionnalites" className="mx-auto max-w-[1128px] scroll-mt-20 px-4 py-20">
          <h2 className="text-3xl font-extrabold tracking-tight">Pourquoi DevOnDeck ?</h2>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Une plateforme dédiée aux profils techniques, plutôt que des CV lus un par un.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="p-7 transition hover:-translate-y-1">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{text}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Comment ça marche */}
        <section id="comment-ca-marche" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-[1128px] px-4 py-20">
            <h2 className="text-3xl font-extrabold tracking-tight">Comment ça marche</h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                      {i + 1}
                    </span>
                    <Icon className="h-6 w-6 text-brand" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Appel à l'action */}
        <section className="mx-auto max-w-[1128px] px-4 py-20">
          <div className="rounded-3xl bg-gradient-to-br from-brand-dark to-brand p-10 text-center text-white sm:p-14">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Prêt à être repéré ?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
              Créez votre profil développeur en quelques minutes.
            </p>
            <Link
              to="/developpeur/inscription"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-base font-semibold text-brand transition hover:bg-brand-soft"
            >
              Créer mon profil développeur
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
