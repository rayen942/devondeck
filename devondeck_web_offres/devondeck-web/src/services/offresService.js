import { authenticatedFetch } from './authSession.js';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const offresUrl = `${apiUrl}/api/organisation/offres`;

async function readError(response, fallback) {
  try {
    const body = await response.json();
    return body.message || fallback;
  } catch {
    return fallback;
  }
}

/** US-13 : offres créées par l'organisation connectée. */
export async function listOffres() {
  const response = await authenticatedFetch(offresUrl);
  if (!response.ok) throw new Error(await readError(response, 'Impossible de charger vos offres.'));
  return response.json();
}

/** US-12 : publication d'une offre (titre, description, compétences). */
export async function createOffre({ title, description, skills }) {
  const response = await authenticatedFetch(offresUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title.trim(), description: description.trim(), skills }),
  });
  if (!response.ok) throw new Error(await readError(response, 'La publication de l’offre a échoué.'));
  return response.json();
}

/** US-14 : suppression d'une offre. */
export async function deleteOffre(id) {
  const response = await authenticatedFetch(`${offresUrl}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error(await readError(response, 'La suppression de l’offre a échoué.'));
}
