// Service d'authentification SIMULÉ.
// À remplacer par des appels à l'API REST Spring Boot (JWT), par exemple :
//   POST /api/auth/login    -> { token, role }
//   POST /api/auth/register -> { id, email }
// Le token JWT sera ensuite envoyé dans l'en-tête Authorization: Bearer <token>.

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

export async function loginOrganisation({ email, password }) {
  await wait(900);
  if (email.trim().toLowerCase() === 'erreur@devondeck.com' || !password) {
    throw new Error('E-mail ou mot de passe incorrect');
  }
  return { token: 'jwt-de-demonstration', role: 'ORGANISATION' };
}

export async function signupOrganisation({ raisonSociale, email }) {
  await wait(1100);
  if (email.trim().toLowerCase() === 'existant@devondeck.com') {
    throw new Error('Un compte existe déjà avec cet e-mail');
  }
  return { id: 1, raisonSociale, email, role: 'ORGANISATION' };
}
