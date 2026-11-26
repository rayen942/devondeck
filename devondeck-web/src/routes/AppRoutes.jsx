import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import LoginDeveloppeur from '../pages/auth/LoginDeveloppeur.jsx';
import SignupDeveloppeur from '../pages/auth/SignupDeveloppeur.jsx';
import LoginOrganisation from '../pages/auth/LoginOrganisation.jsx';
import SignupOrganisation from '../pages/auth/SignupOrganisation.jsx';
import ProfilDeveloppeur from '../pages/profil/ProfilDeveloppeur.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/developpeur/connexion" element={<LoginDeveloppeur />} />
      <Route path="/developpeur/inscription" element={<SignupDeveloppeur />} />
      <Route path="/organisation/connexion" element={<LoginOrganisation />} />
      <Route path="/organisation/inscription" element={<SignupOrganisation />} />
      {/* US-10 / US-08 / US-09 – Profil développeur */}
      <Route path="/developpeur/profil" element={<ProfilDeveloppeur />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
