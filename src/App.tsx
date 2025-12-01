import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/Home';
import { ExercisesPage } from './pages/Exercises';
import { TrainingPage } from './pages/Training';
import { AnalysisPage } from './pages/Analysis';
import { OnboardingPage } from './pages/Onboarding';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { ProfilePage } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="exercises" element={<ExercisesPage />} />
            <Route path="training" element={<TrainingPage />} />
            <Route path="analysis" element={<AnalysisPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
