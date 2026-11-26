import { authenticatedFetch, clearAuthSession, saveAuthSession } from './authSession.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function postOrganizationAuth(path, payload) {
  const response = await fetch(`${apiUrl}/api/auth/organisation/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Une erreur est survenue. Veuillez réessayer.');
  }
  return result;
}

export async function loginDeveloppeur({ email, password }) {
  await wait(900);
  // Cas d'erreur pour la démonstration : cette adresse est toujours refusée.
  if (email.trim().toLowerCase() === 'erreur@devondeck.com' || !password) {
    throw new Error('E-mail ou mot de passe incorrect');
  }
  return { token: 'jwt-de-demonstration', role: 'DEVELOPPEUR' };
}

export async function signupDeveloppeur({ prenom, nom, email }) {
  await wait(1100);
  // Cas d'erreur pour la démonstration : cette adresse est déjà « utilisée ».
  if (email.trim().toLowerCase() === 'existant@devondeck.com') {
    throw new Error('Un compte existe déjà avec cet e-mail');
  }
  return { id: 1, prenom, nom, email, role: 'DEVELOPPEUR' };
}

export async function loginOrganisation({ email, password, remember }) {
  const result = await postOrganizationAuth('login', { email: email.trim(), password });
  if (!result.token || result.role !== 'ORGANISATION' || !result.id) {
    throw new Error('La réponse du serveur est invalide.');
  }

  saveAuthSession(result.token, remember);
  try {
    const response = await authenticatedFetch(`${apiUrl}/api/organisation/session`);
    const profile = await response.json();
    if (!response.ok) {
      throw new Error(profile.message || 'Impossible de vérifier la session.');
    }
    if (profile.id !== result.id || profile.role !== result.role || profile.email !== result.email) {
      throw new Error('Les informations de session reçues ne correspondent pas.');
    }
    return { ...result, ...profile };
  } catch (error) {
    clearAuthSession();
    throw error;
  }
}

export async function signupOrganisation({ raisonSociale, secteur, ville, siteWeb, email, password }) {
  return postOrganizationAuth('register', {
    raisonSociale,
    secteur,
    ville,
    siteWeb,
    email: email.trim(),
    password,
  });
}

export async function getOrganisationSession() {
  const response = await authenticatedFetch(`${apiUrl}/api/organisation/session`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Impossible de récupérer la session.');
  }
  return result;
}

export async function logoutOrganisation() {
  try {
    const response = await authenticatedFetch(`${apiUrl}/api/auth/logout`, { method: 'POST' });
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || 'La déconnexion serveur a échoué.');
    }
  } finally {
    clearAuthSession();
  }
}
