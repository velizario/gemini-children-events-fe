// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import OrganizerDashboard from './pages/OrganizerDashboard'; // Create later
import CreateEventPage from './pages/CreateEventsPage'; // Create later
import ProtectedRoute from './components/ProtectedRoute'; // Create later
import Navbar from './components/Navbar'; // Create later
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional dev tools
import ParentDashboard from './pages/ParentDashboard';
import ProfilePage from './pages/ProfilePage';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar /> {/* Display Navbar on all pages */}
        <div className="container mx-auto p-4 mt-16"> {/* Basic layout */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />

            {/* Protected Routes Example */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}> {/* Add ADMIN later if needed */}
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER']}>
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />

            {/* Add more routes as needed */}
            <Route
              path="/my-registrations" // Or /parent-dashboard
              element={
                // Initially allow any logged-in user, refine with allowedRoles=['PARENT'] later if needed
                <ProtectedRoute allowedRoles={['PARENT']}>
                  <ParentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute> {/* Allow any logged-in user initially */}
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
      {/* Optional: React Query DevTools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// --- Create basic Page Components (in separate files like src/pages/...) ---

// Example: src/pages/HomePage.tsx
// const HomePage = () => <h1 className="text-3xl font-bold">Welcome!</h1>;

// Example: src/pages/LoginPage.tsx
// const LoginPage = () => <h1 className="text-3xl font-bold">Login</h1>;

// ... create other simple page components for now

export default App;