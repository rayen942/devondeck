import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import LoginDeveloppeur from '../pages/auth/LoginDeveloppeur.jsx';
import SignupDeveloppeur from '../pages/auth/SignupDeveloppeur.jsx';
import LoginOrganisation from '../pages/auth/LoginOrganisation.jsx';
import SignupOrganisation from '../pages/auth/SignupOrganisation.jsx';
import OffresOrganisation from '../pages/organisation/OffresOrganisation.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/developpeur/connexion" element={<LoginDeveloppeur />} />
      <Route path="/developpeur/inscription" element={<SignupDeveloppeur />} />
      <Route path="/organisation/connexion" element={<LoginOrganisation />} />
      <Route path="/organisation/inscription" element={<SignupOrganisation />} />
      <Route
        path="/organisation/offres"
        element={
          <ProtectedRoute>
            <OffresOrganisation />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
