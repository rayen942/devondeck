import { useCallback, useEffect, useState } from 'react';
import { Briefcase, Loader2, Plus, Trash2, X } from 'lucide-react';
import Header from '../../components/layout/Header.jsx';
import Footer from '../../components/layout/Footer.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { createOffre, deleteOffre, listOffres } from '../../services/offresService.js';

const MAX_TITLE = 160;
const MAX_DESCRIPTION = 5000;
const MAX_SKILLS = 30;
const MAX_SKILL_LENGTH = 50;
const emptyForm = { title: '', description: '' };

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export default function OffresOrganisation() {
  // Liste (US-13)
  const [offres, setOffres] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState('');

  // Publication (US-12)
  const [form, setForm] = useState(emptyForm);
  const [skills, setSkills] = useState([]);
  const [skillDraft, setSkillDraft] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  // Suppression (US-14)
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadOffres = useCallback(async () => {
    setLoadingList(true);
    setListError('');
    try {
      setOffres(await listOffres());
    } catch (error) {
      setListError(error.message);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadOffres();
  }, [loadOffres]);

  const update = (field) => (e) => setForm((current) => ({ ...current, [field]: e.target.value }));

  /** Ajoute la compétence saisie ; renvoie la nouvelle liste (ou null si la saisie est refusée). */
  const addSkill = (raw, current = skills) => {
    const value = raw.trim();
    if (!value) return current;
    if (value.length > MAX_SKILL_LENGTH) {
      setErrors((e) => ({ ...e, skills: `Une compétence ne doit pas dépasser ${MAX_SKILL_LENGTH} caractères.` }));
      return null;
    }
    if (current.length >= MAX_SKILLS) {
      setErrors((e) => ({ ...e, skills: `Vous pouvez indiquer ${MAX_SKILLS} compétences au maximum.` }));
      return null;
    }
    setErrors((e) => ({ ...e, skills: undefined }));
    if (current.some((s) => s.toLowerCase() === value.toLowerCase())) return current;
    const next = [...current, value];
    setSkills(next);
    return next;
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (addSkill(skillDraft) !== null) setSkillDraft('');
    } else if (e.key === 'Backspace' && !skillDraft && skills.length > 0) {
      setSkills(skills.slice(0, -1));
    }
  };

  const removeSkill = (skill) => setSkills((current) => current.filter((s) => s !== skill));

  const validate = (finalSkills) => {
    const next = {};
    if (!form.title.trim()) next.title = 'Le titre est obligatoire.';
    else if (form.title.trim().length > MAX_TITLE) next.title = `Le titre ne doit pas dépasser ${MAX_TITLE} caractères.`;
    if (!form.description.trim()) next.description = 'La description est obligatoire.';
    else if (form.description.trim().length > MAX_DESCRIPTION) {
      next.description = `La description ne doit pas dépasser ${MAX_DESCRIPTION} caractères.`;
    }
    if (finalSkills.length === 0) next.skills = 'Indiquez au moins une compétence recherchée.';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setNotice('');

    // Une compétence saisie mais pas encore validée par Entrée est prise en compte.
    const finalSkills = addSkill(skillDraft);
    if (finalSkills === null) return;

    const next = validate(finalSkills);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const created = await createOffre({ ...form, skills: finalSkills });
      setOffres((current) => [created, ...current]);
      setForm(emptyForm);
      setSkills([]);
      setSkillDraft('');
      setErrors({});
      setNotice('Votre offre a été publiée.');
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setListError('');
    setNotice('');
    try {
      await deleteOffre(id);
      setOffres((current) => current.filter((o) => o.id !== id));
      setPendingDeleteId(null);
      setNotice('L’offre a été supprimée.');
    } catch (error) {
      setListError(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-[1128px] px-4 py-10">
          <div className="mb-8 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Briefcase className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Mes offres de postes</h1>
              <p className="text-muted">Publiez vos offres et suivez vos recrutements.</p>
            </div>
          </div>

          {notice && (
            <p role="status" className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
              {notice}
            </p>
          )}

          <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* US-12 : publier une offre */}
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-bold">Publier une offre</h2>
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                {serverError && (
                  <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {serverError}
                  </p>
                )}

                <Input
                  id="offre-title"
                  label="Titre de l’offre"
                  placeholder="Développeur Java confirmé"
                  maxLength={MAX_TITLE}
                  value={form.title}
                  onChange={update('title')}
                  error={errors.title}
                />

                <div>
                  <label htmlFor="offre-description" className="mb-1.5 block text-sm font-semibold text-ink">
                    Description
                  </label>
                  <textarea
                    id="offre-description"
                    rows={6}
                    maxLength={MAX_DESCRIPTION}
                    placeholder="Missions, contexte, conditions…"
                    value={form.description}
                    onChange={update('description')}
                    aria-invalid={errors.description ? 'true' : 'false'}
                    aria-describedby={errors.description ? 'offre-description-error' : undefined}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/30 ${
                      errors.description ? 'border-red-600' : 'border-line'
                    }`}
                  />
                  {errors.description && (
                    <p id="offre-description-error" role="alert" className="mt-1.5 text-sm text-red-600">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="offre-skills" className="mb-1.5 block text-sm font-semibold text-ink">
                    Compétences recherchées
                  </label>
                  <div
                    className={`flex flex-wrap items-center gap-2 rounded-xl border bg-white p-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30 ${
                      errors.skills ? 'border-red-600' : 'border-line'
                    }`}
                  >
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-full border border-brand/10 bg-brand-soft py-1 pl-3 pr-1.5 text-sm font-semibold text-brand"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="rounded-full p-0.5 hover:bg-brand/10"
                          aria-label={`Retirer la compétence ${skill}`}
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                    <input
                      id="offre-skills"
                      value={skillDraft}
                      onChange={(e) => setSkillDraft(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder={skills.length ? 'Ajouter…' : 'Java, Spring Boot, React…'}
                      aria-invalid={errors.skills ? 'true' : 'false'}
                      aria-describedby={errors.skills ? 'offre-skills-error' : 'offre-skills-hint'}
                      className="h-8 min-w-[8rem] flex-1 bg-transparent px-2 text-ink outline-none placeholder:text-gray-400"
                    />
                  </div>
                  {errors.skills ? (
                    <p id="offre-skills-error" role="alert" className="mt-1.5 text-sm text-red-600">
                      {errors.skills}
                    </p>
                  ) : (
                    <p id="offre-skills-hint" className="mt-1.5 text-sm text-muted">
                      Validez chaque compétence avec Entrée ou une virgule.
                    </p>
                  )}
                </div>

                <Button type="submit" loading={submitting} className="w-full">
                  {!submitting && <Plus className="h-5 w-5" aria-hidden="true" />}
                  {submitting ? 'Publication…' : 'Publier l’offre'}
                </Button>
              </form>
            </Card>

            {/* US-13 : liste des offres / US-14 : suppression */}
            <section aria-labelledby="offres-list-title">
              <h2 id="offres-list-title" className="text-xl font-bold">
                Offres publiées{!loadingList && !listError ? ` (${offres.length})` : ''}
              </h2>

              {listError && (
                <div role="alert" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {listError}
                  <button type="button" onClick={loadOffres} className="font-semibold underline">
                    Réessayer
                  </button>
                </div>
              )}

              {loadingList ? (
                <p className="mt-6 flex items-center gap-2 text-muted" role="status">
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Chargement de vos offres…
                </p>
              ) : (
                !listError &&
                offres.length === 0 && (
                  <Card className="mt-4 p-8 text-center text-muted">
                    Vous n’avez pas encore publié d’offre. Utilisez le formulaire pour créer la première.
                  </Card>
                )
              )}

              <ul className="mt-4 space-y-4">
                {offres.map((offre) => (
                  <li key={offre.id}>
                    <Card className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="break-words text-lg font-bold">{offre.title}</h3>
                          <p className="text-sm text-muted">Publiée le {formatDate(offre.createdAt)}</p>
                        </div>
                        {pendingDeleteId !== offre.id && (
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(offre.id)}
                            className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-600"
                            aria-label={`Supprimer l’offre « ${offre.title} »`}
                          >
                            <Trash2 className="h-5 w-5" aria-hidden="true" />
                          </button>
                        )}
                      </div>

                      <p className="mt-3 line-clamp-3 whitespace-pre-line break-words text-ink/80">
                        {offre.description}
                      </p>

                      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Compétences recherchées">
                        {offre.skills.map((skill) => (
                          <li
                            key={skill}
                            className="rounded-full border border-brand/10 bg-brand-soft px-3 py-1 text-sm font-semibold text-brand"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>

                      {pendingDeleteId === offre.id && (
                        <div role="alertdialog" aria-label="Confirmer la suppression" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                          <p className="text-sm font-medium text-red-800">
                            Supprimer définitivement cette offre ? Cette action est irréversible.
                          </p>
                          <div className="mt-3 flex gap-3">
                            <Button
                              type="button"
                              loading={deletingId === offre.id}
                              onClick={() => handleDelete(offre.id)}
                              className="!bg-red-600 !px-5 !py-2 !text-sm hover:!bg-red-700"
                            >
                              Supprimer
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              disabled={deletingId === offre.id}
                              onClick={() => setPendingDeleteId(null)}
                              className="!px-5 !py-2 !text-sm"
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
