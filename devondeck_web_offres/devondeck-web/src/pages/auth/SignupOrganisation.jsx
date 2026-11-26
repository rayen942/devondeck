import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, CheckCircle2, Globe, Mail, MapPin } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import Button, { buttonClasses } from '../../components/ui/Button.jsx';
import { signupOrganisation } from '../../services/authService.js';
import {
  isBcryptPasswordLengthValid,
  isEmail,
  passwordLabel,
  passwordScore,
} from '../../utils/validators.js';

const initialForm = {
  raisonSociale: '',
  secteur: '',
  ville: '',
  siteWeb: '',
  email: '',
  password: '',
  confirmation: '',
  terms: false,
};

const strengthStyles = {
  Faible: { bar: 'bg-red-500', text: 'text-red-600', width: 'w-1/4' },
  Moyen: { bar: 'bg-orange-500', text: 'text-orange-700', width: 'w-2/4' },
  Fort: { bar: 'bg-green-600', text: 'text-green-700', width: 'w-full' },
};

export default function SignupOrganisation() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field) => (e) =>
    setForm((current) => ({
      ...current,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

  const score = passwordScore(form.password);
  const label = passwordLabel(score);

  const validate = () => {
    const next = {};
    if (!form.raisonSociale.trim()) next.raisonSociale = 'La raison sociale est obligatoire.';
    if (!form.secteur.trim()) next.secteur = 'Le secteur d’activité est obligatoire.';
    if (!form.ville.trim()) next.ville = 'La ville est obligatoire.';
    if (!isEmail(form.email)) next.email = 'Saisissez une adresse e-mail valide.';
    if (form.password.length < 8) next.password = 'Le mot de passe doit contenir au moins 8 caractères.';
    else if (!isBcryptPasswordLengthValid(form.password)) {
      next.password = 'Le mot de passe ne doit pas dépasser 72 octets.';
    }
    if (form.confirmation !== form.password) next.confirmation = 'Les mots de passe ne correspondent pas.';
    if (!form.terms) next.terms = 'Vous devez accepter les conditions pour continuer.';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await signupOrganisation(form);
      setSuccess(true);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      panelTitle="Créez un espace pour trouver les talents dont vos projets ont besoin."
      mainClassName="signup-organisation-background"
      cardClassName="signup-developer-card"
      panelPoints={[
        'Présentez votre organisation',
        'Publiez des offres adaptées aux compétences',
        'Filtrez les développeurs selon vos besoins',
        'Échangez directement avec les candidats',
      ]}
    >
      {success ? (
        <div className="py-6 text-center" role="status">
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-extrabold">Organisation créée</h1>
          <p className="mt-2 text-muted">
            Bienvenue chez DevOnDeck, {form.raisonSociale} !
          </p>
          <Link to="/organisation/connexion" className={buttonClasses('primary', 'mt-6 w-full')}>
            Se connecter
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Building2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Créez votre espace organisation</h1>
          <p className="mt-2 text-muted">Renseignez les informations essentielles.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {serverError && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {serverError}
              </p>
            )}

            <Input
              id="organisation-raison-sociale"
              label="Raison sociale"
              icon={Building2}
              autoComplete="organization"
              placeholder="Nom de l’organisation"
              value={form.raisonSociale}
              onChange={update('raisonSociale')}
              error={errors.raisonSociale}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="organisation-secteur"
                label="Secteur d’activité"
                placeholder="Ex. FinTech"
                value={form.secteur}
                onChange={update('secteur')}
                error={errors.secteur}
              />
              <Input
                id="organisation-ville"
                label="Ville"
                icon={MapPin}
                autoComplete="address-level2"
                value={form.ville}
                onChange={update('ville')}
                error={errors.ville}
              />
            </div>

            <Input
              id="organisation-site"
              label="Site web (facultatif)"
              icon={Globe}
              type="url"
              placeholder="https://entreprise.com"
              value={form.siteWeb}
              onChange={update('siteWeb')}
            />

            <Input
              id="organisation-signup-email"
              label="Adresse e-mail professionnelle"
              icon={Mail}
              type="email"
              autoComplete="email"
              placeholder="contact@entreprise.com"
              value={form.email}
              onChange={update('email')}
              error={errors.email}
            />

            <div>
              <PasswordInput
                id="organisation-signup-password"
                autoComplete="new-password"
                placeholder="8 caractères minimum"
                value={form.password}
                onChange={update('password')}
                error={errors.password}
              />
              {form.password && (
                <div className="mt-2" aria-live="polite">
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div className={`h-full rounded-full transition-all ${strengthStyles[label].bar} ${strengthStyles[label].width}`} />
                  </div>
                  <p className={`mt-1 text-xs font-semibold ${strengthStyles[label].text}`}>
                    Force du mot de passe : {label}
                  </p>
                </div>
              )}
            </div>

            <PasswordInput
              id="organisation-signup-confirmation"
              label="Confirmer le mot de passe"
              autoComplete="new-password"
              value={form.confirmation}
              onChange={update('confirmation')}
              error={errors.confirmation}
            />

            <div>
              <label className="flex cursor-pointer items-start gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={update('terms')}
                  className="mt-0.5 h-4 w-4 rounded border-line accent-brand"
                />
                <span>
                  J’accepte les{' '}
                  <a href="#" className="font-semibold text-brand hover:underline">conditions d’utilisation</a>{' '}
                  et la{' '}
                  <a href="#" className="font-semibold text-brand hover:underline">politique de confidentialité</a>.
                </span>
              </label>
              {errors.terms && (
                <p role="alert" className="mt-1.5 text-sm text-red-600">{errors.terms}</p>
              )}
            </div>

            <Button type="submit" loading={loading} className="w-full">
              {loading ? 'Création du compte…' : 'Créer mon compte organisation'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Déjà inscrit ?{' '}
            <Link to="/organisation/connexion" className="font-semibold text-brand hover:underline">
              Connectez-vous
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
