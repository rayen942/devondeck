import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Logo from '../../components/layout/Logo.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { getProfile, updateBio, updateLanguages, addSkill, removeSkill, DEV_PROFILE_ID } from '../../services/profileService.js';
import { validateBio, validateLanguages, validateSkill, SKILL_TYPES } from '../../utils/profileValidators.js';

// ----------------------------------------------------------------
//  Langages proposés dans la liste déroulante
// ----------------------------------------------------------------
const LANGAGES_DISPONIBLES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#',
  'PHP', 'Go', 'Kotlin', 'Dart', 'Swift', 'Rust', 'Ruby', 'Scala',
  'R', 'MATLAB', 'Shell', 'SQL', 'HTML/CSS',
];

// ----------------------------------------------------------------
//  Sous-composant : message succès
// ----------------------------------------------------------------
function SuccessMsg({ children }) {
  return (
    <p role="status" className="mt-3 flex items-center gap-2 text-sm font-medium text-green-700">
      <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

// ----------------------------------------------------------------
//  Sous-composant : message erreur
// ----------------------------------------------------------------
function ErrorMsg({ children }) {
  return (
    <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
      {children}
    </p>
  );
}

// ----------------------------------------------------------------
//  Sous-composant : pastille supprimable
// ----------------------------------------------------------------
import { X } from 'lucide-react';

function Pastille({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Supprimer ${label}`}
        className="ml-1 rounded-full hover:bg-brand/10 focus:outline-none focus:ring-2 focus:ring-brand"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </span>
  );
}

// ================================================================
//  Page principale
// ================================================================
export default function ProfilDeveloppeur() {
  // --- État global du chargement ---
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // --- Données du profil ---
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState([]);
  const [skills, setSkills] = useState([]);

  // --- Card Biographie ---
  const [bioValue, setBioValue] = useState('');
  const [bioSaving, setBioSaving] = useState(false);
  const [bioSuccess, setBioSuccess] = useState('');
  const [bioError, setBioError] = useState('');

  // --- Card Langages ---
  const [langSelected, setLangSelected] = useState('');
  const [langSaving, setLangSaving] = useState(false);
  const [langSuccess, setLangSuccess] = useState('');
  const [langError, setLangError] = useState('');

  // --- Card Compétences ---
  const [skillName, setSkillName] = useState('');
  const [skillType, setSkillType] = useState('COMPETENCE');
  const [skillAdding, setSkillAdding] = useState(false);
  const [skillSuccess, setSkillSuccess] = useState('');
  const [skillError, setSkillError] = useState('');

  // ----------------------------------------------------------------
  //  Chargement initial
  // ----------------------------------------------------------------
  useEffect(() => {
    getProfile(DEV_PROFILE_ID)
      .then((data) => {
        setBio(data.bio ?? '');
        setBioValue(data.bio ?? '');
        setLanguages(data.languages ?? []);
        setSkills(data.skills ?? []);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ----------------------------------------------------------------
  //  US-10 : Enregistrer la biographie
  // ----------------------------------------------------------------
  const handleSaveBio = async () => {
    setBioSuccess('');
    setBioError('');
    const err = validateBio(bioValue);
    if (err) { setBioError(err); return; }
    setBioSaving(true);
    try {
      await updateBio(DEV_PROFILE_ID, bioValue);
      setBio(bioValue);
      setBioSuccess('Biographie enregistrée.');
    } catch (e) {
      setBioError(e.message);
    } finally {
      setBioSaving(false);
    }
  };

  // ----------------------------------------------------------------
  //  US-08 : Ajouter un langage
  // ----------------------------------------------------------------
  const handleAddLanguage = () => {
    setLangSuccess('');
    setLangError('');
    if (!langSelected) return;
    const next = [...languages, langSelected];
    const err = validateLanguages(next);
    if (err) { setLangError(err); return; }
    setLanguages(next);
    setLangSelected('');
  };

  const handleRemoveLanguage = (lang) => {
    setLanguages((prev) => prev.filter((l) => l !== lang));
    setLangSuccess('');
    setLangError('');
  };

  const handleSaveLanguages = async () => {
    setLangSuccess('');
    setLangError('');
    const err = validateLanguages(languages);
    if (err) { setLangError(err); return; }
    setLangSaving(true);
    try {
      await updateLanguages(DEV_PROFILE_ID, languages);
      setLangSuccess('Langages enregistrés.');
    } catch (e) {
      setLangError(e.message);
    } finally {
      setLangSaving(false);
    }
  };

  // ----------------------------------------------------------------
  //  US-09 : Ajouter / supprimer une compétence
  // ----------------------------------------------------------------
  const handleAddSkill = async () => {
    setSkillSuccess('');
    setSkillError('');
    const err = validateSkill(skillName, skillType);
    if (err) { setSkillError(err); return; }
    setSkillAdding(true);
    try {
      const updated = await addSkill(DEV_PROFILE_ID, skillName.trim(), skillType);
      setSkills(updated.skills ?? skills);
      setSkillName('');
      setSkillSuccess('Compétence ajoutée.');
    } catch (e) {
      setSkillError(e.message);
    } finally {
      setSkillAdding(false);
    }
  };

  const handleRemoveSkill = async (skillId, skillLabel) => {
    setSkillSuccess('');
    setSkillError('');
    try {
      await removeSkill(DEV_PROFILE_ID, skillId);
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
    } catch (e) {
      setSkillError(e.message);
    }
  };

  // ----------------------------------------------------------------
  //  Rendu
  // ----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-canvas">
      {/* Barre de navigation minimale */}
      <header className="border-b border-line bg-white px-4 py-3">
        <div className="mx-auto max-w-[1128px]">
          <Logo />
        </div>
      </header>

      <main className="mx-auto max-w-[1128px] px-4 py-8">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-ink">
          Mon profil développeur
        </h1>

        {/* Chargement */}
        {loading && (
          <p className="text-muted" aria-live="polite">Chargement…</p>
        )}

        {/* Erreur de chargement (backend arrêté) */}
        {!loading && loadError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            <p className="font-semibold">Impossible de charger le profil.</p>
            <p className="mt-1 text-sm">{loadError}</p>
          </div>
        )}

        {/* Contenu principal */}
        {!loading && !loadError && (
          <div className="grid gap-6">

            {/* ============ Card Biographie (US-10) ============ */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-bold text-ink">Biographie</h2>

              <label htmlFor="bio-textarea" className="mb-1.5 block text-sm font-semibold text-ink">
                Présentez-vous aux organisations
              </label>
              <div className="relative">
                <textarea
                  id="bio-textarea"
                  rows={5}
                  maxLength={600}
                  value={bioValue}
                  onChange={(e) => { setBioValue(e.target.value); setBioSuccess(''); setBioError(''); }}
                  placeholder="Ex. : Développeur fullstack passionné par React et Spring Boot…"
                  aria-describedby="bio-counter"
                  className="w-full resize-none rounded-xl border border-line bg-white p-4 text-ink outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/30"
                />
              </div>
              <p
                id="bio-counter"
                className={`mt-1 text-right text-sm font-medium ${bioValue.length > 500 ? 'text-red-600' : 'text-muted'}`}
              >
                {bioValue.length}/500
              </p>

              {bioSuccess && <SuccessMsg>{bioSuccess}</SuccessMsg>}
              {bioError && <ErrorMsg>{bioError}</ErrorMsg>}

              <Button
                className="mt-4"
                loading={bioSaving}
                disabled={bioValue.length > 500}
                onClick={handleSaveBio}
              >
                Enregistrer
              </Button>
            </Card>

            {/* ============ Card Langages (US-08) ============ */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-bold text-ink">
                Mes 5 langages principaux
              </h2>

              {/* Pastilles */}
              {languages.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <Pastille
                      key={lang}
                      label={lang}
                      onRemove={() => handleRemoveLanguage(lang)}
                    />
                  ))}
                </div>
              )}

              {/* Compteur */}
              <p className="mb-3 text-sm text-muted">
                <span className={languages.length >= 5 ? 'font-semibold text-brand' : ''}>{languages.length}</span>/5 langages
              </p>

              {/* Message maximum */}
              {languages.length >= 5 && (
                <p role="status" className="mb-3 text-sm font-medium text-brand">
                  Maximum 5 langages atteint.
                </p>
              )}

              {/* Sélecteur + bouton Ajouter */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label htmlFor="lang-select" className="sr-only">Choisir un langage</label>
                  <select
                    id="lang-select"
                    value={langSelected}
                    onChange={(e) => setLangSelected(e.target.value)}
                    disabled={languages.length >= 5}
                    className="h-12 w-full rounded-xl border border-line bg-white px-4 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:opacity-60"
                  >
                    <option value="">— Sélectionner un langage —</option>
                    {LANGAGES_DISPONIBLES.filter((l) => !languages.includes(l)).map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <Button
                  variant="outline"
                  disabled={languages.length >= 5 || !langSelected}
                  onClick={handleAddLanguage}
                >
                  Ajouter
                </Button>
              </div>

              {langSuccess && <SuccessMsg>{langSuccess}</SuccessMsg>}
              {langError && <ErrorMsg>{langError}</ErrorMsg>}

              <Button
                className="mt-4"
                loading={langSaving}
                disabled={languages.length === 0}
                onClick={handleSaveLanguages}
              >
                Enregistrer les langages
              </Button>
            </Card>

            {/* ============ Card Compétences (US-09) ============ */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-bold text-ink">
                Compétences, frameworks et bibliothèques
              </h2>

              {/* Pastilles */}
              {skills.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Pastille
                      key={skill.id}
                      label={`${skill.name} · ${skill.type}`}
                      onRemove={() => handleRemoveSkill(skill.id, skill.name)}
                    />
                  ))}
                </div>
              )}

              {/* Formulaire d'ajout */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  id="skill-name"
                  label="Nom de la compétence"
                  placeholder="Ex. : React, Docker, TDD…"
                  value={skillName}
                  onChange={(e) => { setSkillName(e.target.value); setSkillSuccess(''); setSkillError(''); }}
                  className="flex-1"
                />

                <div className="flex flex-col sm:w-48">
                  <label htmlFor="skill-type" className="mb-1.5 block text-sm font-semibold text-ink">
                    Type
                  </label>
                  <select
                    id="skill-type"
                    value={skillType}
                    onChange={(e) => setSkillType(e.target.value)}
                    className="h-12 w-full rounded-xl border border-line bg-white px-4 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
                  >
                    <option value="COMPETENCE">Compétence</option>
                    <option value="FRAMEWORK">Framework</option>
                    <option value="BIBLIOTHEQUE">Bibliothèque</option>
                  </select>
                </div>
              </div>

              {skillSuccess && <SuccessMsg>{skillSuccess}</SuccessMsg>}
              {skillError && <ErrorMsg>{skillError}</ErrorMsg>}

              <Button
                className="mt-4"
                loading={skillAdding}
                onClick={handleAddSkill}
              >
                Ajouter la compétence
              </Button>
            </Card>

          </div>
        )}
      </main>
    </div>
  );
}
