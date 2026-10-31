import { Routes, Route } from 'react-router-dom';
import { ViewerPage } from './pages/ViewerPage';
import { StatusPage } from './pages/StatusPage';
import { AboutPage } from './pages/AboutPage';
import { HowToUsePage } from './pages/HowToUsePage';
import { TripCollectionsProvider } from './context/TripCollectionsContext';
import { GpxStatusProvider } from './context/GpxStatusContext';

function App() {
  return (
    <GpxStatusProvider>
      <TripCollectionsProvider>
        <Routes>
          <Route path="/" element={<ViewerPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-to-use" element={<HowToUsePage />} />
        </Routes>
      </TripCollectionsProvider>
    </GpxStatusProvider>
  );
}

export default App;
