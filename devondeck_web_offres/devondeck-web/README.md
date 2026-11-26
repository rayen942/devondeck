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
- `/organisation/offres` : `src/pages/organisation/OffresOrganisation.jsx` (réservée aux organisations connectées)

## Authentification organisation

L'authentification organisation utilise une API Spring Boot avec une base H2 locale et des mots de passe hachés avec BCrypt.

1. Démarrer l'API depuis `backend/` avec `mvn spring-boot:run`.
2. Démarrer le frontend avec `npm run dev`.
3. Créer un compte sur `/organisation/inscription`, puis se connecter sur `/organisation/connexion`.

Endpoints :
- `POST /api/auth/organisation/register` : crée une organisation.
- `POST /api/auth/organisation/login` : vérifie les identifiants et renvoie un JWT.
- `POST /api/auth/logout` : révoque le JWT courant ; cet endpoint exige un Bearer token valide.
- `GET /api/organisation/session` : exemple d'endpoint protégé, réservé au rôle `ORGANISATION`.

## Gestion des offres de postes (US-12, US-13, US-14)

Endpoints réservés au rôle `ORGANISATION` (chaque organisation ne voit et ne modifie que ses propres offres) :
- `POST /api/organisation/offres` : publie une offre (`title`, `description`, `skills`) — US-12.
- `GET /api/organisation/offres` : liste les offres de l'organisation connectée, les plus récentes d'abord — US-13.
- `DELETE /api/organisation/offres/{id}` : supprime une offre (404 si elle n'existe pas ou appartient à une autre organisation) — US-14.

Code backend : `backend/src/main/java/com/devondeck/auth/joboffer/`, tests : `JobOfferApiTest`.

Le backend écoute sur le port `8080`. `VITE_API_URL` permet de configurer son URL côté frontend. Le JWT contient l'identifiant du compte (sujet), son e-mail, son rôle, un identifiant unique et son expiration. Le frontend le conserve dans `sessionStorage` par défaut, ou dans `localStorage` si « Se souvenir de moi » est coché, puis l'envoie dans l'en-tête `Authorization: Bearer ...` pour les appels protégés. La déconnexion appelle l'API, révoque le jeton dans la base et le retire du navigateur. Les entrées de révocation sont purgées après expiration.

La configuration Spring Security est sans session serveur. Les routes `/api/organisation/**` exigent un JWT valide avec le rôle `ORGANISATION`. Les comptes développeur n'ont pas encore d'authentification backend : leur formulaire reste simulé.

Avant tout déploiement, définir `JWT_SECRET` avec une clé secrète forte, ainsi que les variables de connexion à une base de données adaptée à la production. L'authentification développeur reste simulée.
