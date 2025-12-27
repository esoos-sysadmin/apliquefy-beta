import { HashRouter, Routes, Route } from 'react-router-dom';
import  Login  from './pages/login';
import  DashboardPage  from './pages/dashboard';

function App() {
  return (
    // No Electron usamos HashRouter (#/dashboard) para evitar problemas com file://
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;