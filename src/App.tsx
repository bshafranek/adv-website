import { Routes, Route } from 'react-router-dom';
import { ViewerPage } from './pages/ViewerPage';
import { StatusPage } from './pages/StatusPage';
import { TripCollectionsProvider } from './context/TripCollectionsContext';
import { GpxStatusProvider } from './context/GpxStatusContext';

function App() {
  return (
    <GpxStatusProvider>
      <TripCollectionsProvider>
        <Routes>
          <Route path="/" element={<ViewerPage />} />
          <Route path="/status" element={<StatusPage />} />
        </Routes>
      </TripCollectionsProvider>
    </GpxStatusProvider>
  );
}

export default App;
