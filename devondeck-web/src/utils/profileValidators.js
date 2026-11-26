/**
 * Validations frontend spécifiques au profil développeur.
 * Fichier séparé de validators.js (fichier des camarades) pour éviter les conflits.
 */

const SKILL_TYPES = ['FRAMEWORK', 'BIBLIOTHEQUE', 'COMPETENCE'];

/** Valide la biographie : max 500 caractères. */
export function validateBio(text) {
  if (text.length > 500) return 'La biographie ne peut pas dépasser 500 caractères.';
  return null;
}

/**
 * Valide la liste de langages :
 * - au plus 5 éléments
 * - pas de doublon (insensible à la casse)
 * - aucun élément vide
 */
export function validateLanguages(list) {
  if (list.some((l) => !l || !l.trim())) return 'Un langage ne peut pas être vide.';
  if (list.length > 5) return 'Vous ne pouvez pas ajouter plus de 5 langages.';
  const lower = list.map((l) => l.trim().toLowerCase());
  if (new Set(lower).size !== lower.length) return 'Ce langage est déjà dans votre liste.';
  return null;
}

/**
 * Valide une compétence à ajouter :
 * - nom non vide après trim
 * - type parmi FRAMEWORK, BIBLIOTHEQUE, COMPETENCE
 */
export function validateSkill(name, type) {
  if (!name || !name.trim()) return 'Le nom de la compétence est obligatoire.';
  if (!SKILL_TYPES.includes(type)) return 'Le type sélectionné est invalide.';
  return null;
}

export { SKILL_TYPES };
