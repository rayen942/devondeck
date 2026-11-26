# DevOnDeck – Accueil et authentification développeur / organisation

React + Vite + Tailwind CSS.

## Lancer le projet
    npm install
    npm run dev

## Routes
- `/` : page d'accueil
- `/developpeur/connexion` : `src/pages/auth/LoginDeveloppeur.jsx`
- `/developpeur/inscription` : `src/pages/auth/SignupDeveloppeur.jsx`
- `/organisation/connexion` : `src/pages/auth/LoginOrganisation.jsx`
- `/organisation/inscription` : `src/pages/auth/SignupOrganisation.jsx`

## Démo (authentification simulée dans `src/services/authService.js`)
- `erreur@devondeck.com` : la connexion échoue.
- `existant@devondeck.com` : l'inscription échoue (e-mail déjà utilisé).
- Toute autre adresse valide fonctionne.

Pour brancher le back end Spring Boot (JWT), remplacer les deux fonctions de `authService.js` par des appels `fetch` vers l'API REST.
