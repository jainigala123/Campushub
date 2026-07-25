import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import LandingPage from './pages/Landing/LandingPage';
import EventsPage from './pages/Events/EventsPage';
import EventDetailsPage from './pages/Events/EventDetailsPage';
import ClubsPage from './pages/Clubs/ClubsPage';
import ClubDetailsPage from './pages/Clubs/ClubDetailsPage';
import AboutPage from './pages/About/AboutPage';
import ContactPage from './pages/Contact/ContactPage';
import PrivacyPage from './pages/Contact/PrivacyPage';
import TermsPage from './pages/Contact/TermsPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailsPage />} />
        <Route path="clubs" element={<ClubsPage />} />
        <Route path="clubs/:id" element={<ClubDetailsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/signup" element={<SignupPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
