import { Routes, Route } from 'react-router-dom';
import { ViewerPage } from './pages/ViewerPage';
import { StatusPage } from './pages/StatusPage';
import { AboutPage } from './pages/AboutPage';
import { HowToUsePage } from './pages/HowToUsePage';
import { DownloadPage } from './pages/DownloadPage';
import { SettingsPage } from './pages/SettingsPage';
import { TripCollectionsProvider } from './context/TripCollectionsContext';
import { GpxStatusProvider } from './context/GpxStatusContext';
import { SettingsProvider } from './context/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <GpxStatusProvider>
        <TripCollectionsProvider>
          <Routes>
            <Route path="/" element={<ViewerPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-to-use" element={<HowToUsePage />} />
            <Route path="/download" element={<DownloadPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </TripCollectionsProvider>
      </GpxStatusProvider>
    </SettingsProvider>
  );
}

export default App;
