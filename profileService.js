const ACCOUNT_KEY = 'devondeck_current_account';

export function getCurrentAccount() {
  try {
    return JSON.parse(window.localStorage.getItem(ACCOUNT_KEY) || 'null');
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const account = getCurrentAccount();
  if (!account?.id) throw new Error('Vous devez être connecté pour gérer votre profil.');
  const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', 'X-Account-Id': String(account.id), ...(options.headers || {}) } });
  if (response.status === 404) return null;
  if (!response.ok) {
    let message = 'Une erreur est survenue avec le serveur.';
    try { message = (await response.json()).message || message; } catch { /* réponse non JSON */ }
    throw new Error(message);
  }
  return response.json();
}

export function getDeveloperProfile() { return request('/api/developpeurs/profil'); }

export function createDeveloperProfile(data) {
  const account = getCurrentAccount();
  return request('/api/developpeurs/profil', { method: 'POST', body: JSON.stringify({ ...data, email: account.email }) });
}

export function updateDeveloperProfile(data) {
  const account = getCurrentAccount();
  return request('/api/developpeurs/profil', { method: 'PUT', body: JSON.stringify({ ...data, email: account.email }) });
}
