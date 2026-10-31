import { Routes, Route } from 'react-router-dom';
import { ViewerPage } from './pages/ViewerPage';
import { StatusPage } from './pages/StatusPage';
import { TripCollectionsProvider } from './context/TripCollectionsContext';

function App() {
  return (
    <TripCollectionsProvider>
      <Routes>
        <Route path="/" element={<ViewerPage />} />
        <Route path="/status" element={<StatusPage />} />
      </Routes>
    </TripCollectionsProvider>
  );
}

export default App;
