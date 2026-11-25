import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Code2, Github, Globe, Linkedin, MapPin, Plus, Save, Trash2, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { createDeveloperProfile, getCurrentAccount, getDeveloperProfile, updateDeveloperProfile } from '../../services/profileService.js';

const empty = { prenom: '', nom: '', titre: '', ville: '', bio: '', langages: ['', '', '', '', ''], competences: '', frameworks: '', bibliotheques: '', github: '', linkedin: '', portfolio: '', disponibilite: 'Disponible' };

function validate(form) {
  const errors = {};
  if (!form.prenom.trim()) errors.prenom = 'Le prénom est obligatoire.';
  if (!form.nom.trim()) errors.nom = 'Le nom est obligatoire.';
  if (!form.titre.trim()) errors.titre = 'Le titre professionnel est obligatoire.';
  if (!form.ville.trim()) errors.ville = 'La ville est obligatoire.';
  if (form.langages.filter((value) => value.trim()).length < 1) errors.langages = 'Ajoutez au moins un langage principal.';
  if (!form.bio.trim()) errors.bio = 'La biographie est obligatoire.';
  else if (form.bio.trim().length < 30) errors.bio = 'La biographie doit contenir au moins 30 caractères.';
  return errors;
}

export default function DeveloperProfileForm({ editing = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!editing) {
      const account = getCurrentAccount();
      if (account) setForm((current) => ({ ...current, prenom: account.prenom || '', nom: account.nom || '' }));
      return;
    }
    getDeveloperProfile().then((profile) => {
      if (profile) setForm({ ...empty, ...profile, langages: [...(profile.langages || []), '', '', '', '', ''].slice(0, 5) });
      else navigate('/developpeur/profil/creer', { replace: true });
    }).catch((error) => setServerError(error.message)).finally(() => setLoading(false));
  }, [editing, navigate]);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const updateLanguage = (index) => (event) => setForm((current) => ({ ...current, langages: current.langages.map((value, i) => i === index ? event.target.value : value) }));
  const addLanguage = () => setForm((current) => current.langages.length < 5 ? ({ ...current, langages: [...current.langages, ''] }) : current);
  const removeLanguage = (index) => setForm((current) => ({ ...current, langages: current.langages.filter((_, i) => i !== index) }));

  const submit = async (event) => {
    event.preventDefault(); setServerError('');
    const nextErrors = validate(form); setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    try { await (editing ? updateDeveloperProfile(form) : createDeveloperProfile(form)); setSuccess(true); }
    catch (error) { setServerError(error.message); }
    finally { setSaving(false); }
  };

  if (loading) return <AuthLayout panelTitle="Votre profil, votre meilleure vitrine technique." panelPoints={['Valorisez vos compétences', 'Restez visible auprès des organisations']}><p className="text-center text-muted">Chargement du profil…</p></AuthLayout>;
  if (success) return <AuthLayout panelTitle="Votre profil est prêt à être découvert." panelPoints={['Présentez votre expertise', 'Gardez vos informations à jour']}><div className="py-8 text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-green-600" /><h1 className="mt-4 text-2xl font-extrabold">Profil {editing ? 'mis à jour' : 'créé'} !</h1><p className="mt-2 text-muted">Les organisations peuvent maintenant découvrir votre expertise.</p><Button className="mt-6 w-full" onClick={() => navigate('/developpeur/profil/modifier')}>Modifier mon profil</Button><Link to="/" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">Retour à l’accueil</Link></div></AuthLayout>;

  return <AuthLayout panelTitle="Votre profil, votre meilleure vitrine technique." panelPoints={['Présentez vos cinq langages principaux', 'Ajoutez frameworks et bibliothèques', 'Restez visible auprès des organisations']} cardClassName="!max-w-3xl" mainClassName="py-8">
    <Link to={editing ? '/' : '/developpeur/inscription'} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand"><ArrowLeft className="h-4 w-4" /> Retour</Link>
    <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand"><Code2 /></span><div><h1 className="text-3xl font-extrabold">{editing ? 'Modifier mon profil' : 'Créer mon profil développeur'}</h1><p className="mt-1 text-muted">Les champs marqués sont nécessaires pour vous présenter.</p></div></div>
    <form onSubmit={submit} noValidate className="mt-8 space-y-7">
      {serverError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{serverError}</p>}
      <section><h2 className="text-lg font-bold">Informations personnelles</h2><div className="mt-4 grid gap-5 sm:grid-cols-2"><Input id="profile-prenom" label="Prénom" icon={User} value={form.prenom} onChange={update('prenom')} error={errors.prenom} /><Input id="profile-nom" label="Nom" icon={User} value={form.nom} onChange={update('nom')} error={errors.nom} /><Input id="profile-titre" label="Titre professionnel" placeholder="Ex. Développeur Full Stack" value={form.titre} onChange={update('titre')} error={errors.titre} /><Input id="profile-ville" label="Ville" icon={MapPin} placeholder="Ex. Tunis" value={form.ville} onChange={update('ville')} error={errors.ville} /></div></section>
      <section><h2 className="text-lg font-bold">Compétences principales</h2><p className="mt-1 text-sm text-muted">Ajoutez jusqu’à cinq langages de programmation.</p><div className="mt-4 grid gap-4 sm:grid-cols-2">{form.langages.map((value, index) => <div key={index} className="flex items-end gap-2"><Input id={`profile-langage-${index}`} label={`Langage ${index + 1}`} placeholder={index === 0 ? 'Ex. JavaScript' : 'Ex. Java'} value={value} onChange={updateLanguage(index)} error={index === 0 ? errors.langages : undefined} /><button type="button" aria-label={`Supprimer le langage ${index + 1}`} onClick={() => removeLanguage(index)} className="mb-1.5 rounded-lg p-3 text-muted hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>)}</div>{form.langages.length < 5 && <button type="button" onClick={addLanguage} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand"><Plus className="h-4 w-4" /> Ajouter un langage</button>}</section>
      <section><h2 className="text-lg font-bold">Présentation</h2><div className="mt-4 space-y-5"><div><label htmlFor="profile-bio" className="mb-1.5 block text-sm font-semibold">Biographie</label><textarea id="profile-bio" rows="5" value={form.bio} onChange={update('bio')} placeholder="Présentez votre expérience, vos objectifs et ce que vous aimez construire…" className={`w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/30 ${errors.bio ? 'border-red-600' : 'border-line'}`} />{errors.bio && <p role="alert" className="mt-1.5 text-sm text-red-600">{errors.bio}</p>}</div><div className="grid gap-5 sm:grid-cols-3"><Input id="profile-competences" label="Compétences" placeholder="Git, Docker" value={form.competences} onChange={update('competences')} /><Input id="profile-frameworks" label="Frameworks" placeholder="React, Spring" value={form.frameworks} onChange={update('frameworks')} /><Input id="profile-libraries" label="Bibliothèques" placeholder="Tailwind, Jest" value={form.bibliotheques} onChange={update('bibliotheques')} /></div></div></section>
      <section><h2 className="text-lg font-bold">Liens et disponibilité</h2><div className="mt-4 grid gap-5 sm:grid-cols-2"><Input id="profile-github" label="GitHub (facultatif)" icon={Github} type="url" placeholder="https://github.com/…" value={form.github} onChange={update('github')} /><Input id="profile-linkedin" label="LinkedIn (facultatif)" icon={Linkedin} type="url" placeholder="https://linkedin.com/in/…" value={form.linkedin} onChange={update('linkedin')} /><Input id="profile-portfolio" label="Portfolio (facultatif)" icon={Globe} type="url" placeholder="https://…" value={form.portfolio} onChange={update('portfolio')} /><div><label htmlFor="profile-disponibilite" className="mb-1.5 block text-sm font-semibold">Disponibilité</label><select id="profile-disponibilite" value={form.disponibilite} onChange={update('disponibilite')} className="h-12 w-full rounded-xl border border-line bg-white px-4 text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"><option>Disponible</option><option>Disponible prochainement</option><option>Non disponible</option></select></div></div></section>
      <Button type="submit" loading={saving} className="w-full"><Save className="h-5 w-5" /> {saving ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Créer mon profil'}</Button>
    </form>
  </AuthLayout>;
}
