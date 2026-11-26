export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export const isBcryptPasswordLengthValid = (value) => new TextEncoder().encode(value).length <= 72;

/** Score de 0 à 4 : longueur, majuscule + minuscule, chiffre, caractère spécial. */
export function passwordScore(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export function passwordLabel(score) {
  if (score <= 1) return 'Faible';
  if (score === 2) return 'Moyen';
  return 'Fort';
}
