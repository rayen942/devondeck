const TOKEN_KEY = 'devondeck.auth.token';

function decodeToken(token) {
  try {
    const encodedPayload = token.split('.')[1];
    if (!encodedPayload) return null;
    const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

function tokenStorage() {
  if (sessionStorage.getItem(TOKEN_KEY)) return sessionStorage;
  if (localStorage.getItem(TOKEN_KEY)) return localStorage;
  return null;
}

export function clearAuthSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function readAuthSession() {
  const storage = tokenStorage();
  if (!storage) return null;

  const token = storage.getItem(TOKEN_KEY);
  const claims = decodeToken(token);
  const expiresAt = claims?.exp ? claims.exp * 1000 : 0;
  const id = Number(claims?.sub);
  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    !claims.email ||
    claims.role !== 'ORGANISATION' ||
    expiresAt <= Date.now()
  ) {
    clearAuthSession();
    return null;
  }

  return { token, id, email: claims.email, role: claims.role, expiresAt };
}

export function saveAuthSession(token, remember = false) {
  const claims = decodeToken(token);
  if (
    !claims?.sub ||
    !claims.email ||
    claims.role !== 'ORGANISATION' ||
    !claims.exp ||
    claims.exp * 1000 <= Date.now()
  ) {
    throw new Error('Le jeton de session reçu est invalide.');
  }

  clearAuthSession();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  return readAuthSession();
}

export async function authenticatedFetch(url, options = {}) {
  const session = readAuthSession();
  const headers = new Headers(options.headers || {});
  if (session) headers.set('Authorization', `Bearer ${session.token}`);

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 && session) {
    clearAuthSession();
    window.dispatchEvent(new Event('devondeck:session-expired'));
  }
  return response;
}
