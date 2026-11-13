import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Prediction from './pages/Prediction';
import Workforce from './pages/Workforce';
import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg">
        <Navbar />
        {/* Desktop: offset for sidebar; Mobile: offset for top bar */}
        <main className="lg:ml-56 pt-14 lg:pt-0 px-4 lg:px-8 py-6 lg:py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/workforce" element={<Workforce />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
