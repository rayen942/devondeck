/**
 * Service d'accès à l'API profil développeur.
 * Base URL lue depuis la variable d'environnement Vite VITE_API_URL.
 * Pattern d'erreur identique à authService.js : throw new Error(json.message).
 */

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

/**
 * Identifiant provisoire du profil connecté.
 * À remplacer par l'identifiant extrait du JWT une fois l'auth intégrée.
 */
export const DEV_PROFILE_ID = 1;

// ----------------------------------------------------------------
//  Helper interne
// ----------------------------------------------------------------

async function handleResponse(res) {
  if (res.ok) return res.json();
  let message = `Erreur ${res.status}`;
  try {
    const body = await res.json();
    if (body?.message) message = body.message;
  } catch {
    /* le corps n'est pas du JSON, on garde le message par défaut */
  }
  throw new Error(message);
}

// ----------------------------------------------------------------
//  Lecture
// ----------------------------------------------------------------

/** Récupère le profil complet (bio, languages, skills). */
export async function getProfile(id) {
  const res = await fetch(`${BASE}/api/profiles/${id}`);
  return handleResponse(res);
}

// ----------------------------------------------------------------
//  US-10 – Biographie
// ----------------------------------------------------------------

/** Met à jour la biographie du profil. */
export async function updateBio(id, bio) {
  const res = await fetch(`${BASE}/api/profiles/${id}/bio`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bio }),
  });
  return handleResponse(res);
}

// ----------------------------------------------------------------
//  US-08 – Langages
// ----------------------------------------------------------------

/** Remplace la liste complète des langages du profil. */
export async function updateLanguages(id, languages) {
  const res = await fetch(`${BASE}/api/profiles/${id}/languages`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ languages }),
  });
  return handleResponse(res);
}

// ----------------------------------------------------------------
//  US-09 – Compétences / frameworks / bibliothèques
// ----------------------------------------------------------------

/** Ajoute une compétence au profil. */
export async function addSkill(id, name, type) {
  const res = await fetch(`${BASE}/api/profiles/${id}/skills`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type }),
  });
  return handleResponse(res);
}

/** Supprime une compétence du profil. */
export async function removeSkill(profileId, skillId) {
  const res = await fetch(`${BASE}/api/profiles/${profileId}/skills/${skillId}`, {
    method: 'DELETE',
  });
  // DELETE réussi peut renvoyer 204 (pas de corps)
  if (res.status === 204 || res.ok) return;
  return handleResponse(res);
}
