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
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import ManagerDashboard from './pages/Dashboard/ManagerDashboard';
import MobileScannerPage from './pages/Scanner/MobileScannerPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Protected Fullscreen Mobile Scanner Web-App Route */}
        <Route
          path="/scanner"
          element={
            <ProtectedRoute allowedRole="organizer">
              <MobileScannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan"
          element={
            <ProtectedRoute allowedRole="organizer">
              <MobileScannerPage />
            </ProtectedRoute>
          }
        />

        {/* Standard Layout Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route path="clubs" element={<ClubsPage />} />
          <Route path="clubs/:id" element={<ClubDetailsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />

          {/* Student Dashboard (Students Only) */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="student/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Club Manager Portal (Organizers Only) */}
          <Route
            path="manager/dashboard"
            element={
              <ProtectedRoute allowedRole="organizer">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="organizer/dashboard"
            element={
              <ProtectedRoute allowedRole="organizer">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="profile" element={<ProfilePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="register" element={<SignupPage />} />
          <Route path="auth/login" element={<LoginPage />} />
          <Route path="auth/signup" element={<SignupPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
