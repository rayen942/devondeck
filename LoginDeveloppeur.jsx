import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Mail } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import Button from '../../components/ui/Button.jsx';
import { loginDeveloppeur } from '../../services/authService.js';
import { isEmail } from '../../utils/validators.js';

export default function LoginDeveloppeur() {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const validate = () => {
    const next = {};
    if (!isEmail(form.email)) next.email = 'Saisissez une adresse e-mail valide.';
    if (!form.password) next.password = 'Le mot de passe est obligatoire.';
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
      await loginDeveloppeur(form);
      setSuccess(true); // Plus tard : stocker le JWT puis rediriger vers le tableau de bord.
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      panelTitle="Retrouvez vos opportunités là où vous les avez laissées."
      panelPoints={[
        'Suivez vos candidatures',
        'Répondez aux messages des organisations',
        'Gardez votre profil à jour',
      ]}
    >
      {success ? (
        <div className="py-6 text-center" role="status">
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-extrabold">Connexion réussie</h1>
          <p className="mt-2 text-muted">
            Votre espace développeur sera disponible prochainement.
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-extrabold tracking-tight">Content de vous revoir</h1>
          <p className="mt-2 text-muted">Connectez-vous à votre espace développeur.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {serverError && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {serverError}
              </p>
            )}

            <Input
              id="login-email"
              label="Adresse e-mail"
              icon={Mail}
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              value={form.email}
              onChange={update('email')}
              error={errors.email}
            />

            <PasswordInput
              id="login-password"
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              value={form.password}
              onChange={update('password')}
              error={errors.password}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-ink">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={update('remember')}
                  className="h-4 w-4 rounded border-line accent-brand"
                />
                Se souvenir de moi
              </label>
              <a href="#" className="font-semibold text-brand hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              {loading ? 'Connexion…' : 'Se connecter'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Pas encore de compte ?{' '}
            <Link to="/developpeur/inscription" className="font-semibold text-brand hover:underline">
              Inscrivez-vous
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
