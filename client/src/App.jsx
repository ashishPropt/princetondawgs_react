import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Team from './pages/Team';
import Leagues from './pages/Leagues';
import Tournament from './pages/Tournament';
import TieDetail from './pages/TieDetail';
import Standings from './pages/Standings';
import Sponsors from './pages/Sponsors';
import Shop from './pages/Shop';
import Join from './pages/Join';
import UstaRegister from './pages/UstaRegister';
import Events from './pages/Events';
import Admin from './pages/Admin';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';

export default function App() {
  return (
    <>
      <Nav />
      <main className="site-main">
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/register"       element={<Register />} />
          <Route path="/join"           element={<Join />} />
          <Route path="/team"           element={<Team />} />
          <Route path="/leagues"        element={<Leagues />} />
          <Route path="/tournament"     element={<Tournament />} />
          <Route path="/tie/:id"        element={<TieDetail />} />
          <Route path="/standings"      element={<Standings />} />
          <Route path="/sponsors"       element={<Sponsors />} />
          <Route path="/shop"           element={<Shop />} />
          <Route path="/events"         element={<Events />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/usta-register"  element={<RequireAuth><UstaRegister /></RequireAuth>} />
          <Route path="/dashboard"      element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/admin"          element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
