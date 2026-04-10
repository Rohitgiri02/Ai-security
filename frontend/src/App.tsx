import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { ToastHost } from './components/ToastHost';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { SignUpPage } from './pages/SignUp.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { AddProject } from './pages/AddProject.tsx';
import { ProjectDetails } from './pages/ProjectDetails.tsx';
import { ScanReport } from './pages/ScanReport.tsx';
import { Settings } from './pages/Settings.tsx';
import { setApiTokenGetter, syncUserProfile } from './lib/api';
import './index.css';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="glass-panel px-6 py-4 text-sm tracking-wide">Loading session...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-primary text-white lg:flex">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-6 pb-16 md:px-8 md:py-8 md:pb-20">
            <Outlet />
          </main>
          <Footer className="mt-auto" />
        </div>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    setApiTokenGetter(async () => {
      const token = await getToken();
      return token || null;
    });
  }, [getToken]);

  useEffect(() => {
    if (!isSignedIn || !user) {
      return;
    }

    syncUserProfile({
      email: user.primaryEmailAddress?.emailAddress,
      username: user.username || undefined,
      displayName: user.fullName || user.firstName || undefined,
      avatarUrl: user.imageUrl || undefined,
    }).catch((error) => {
      console.error('Failed to sync user profile', error);
    });
  }, [isSignedIn, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUpPage />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/project/:projectId" element={<ProjectDetails />} />
          <Route path="/scan-report/:projectId" element={<ScanReport />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastHost />
    </BrowserRouter>
  );
}

export default App;
