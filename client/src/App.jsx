import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Update from './pages/Update';

export default function App() {
  return (
    <Routes>
      <Route path="/"       element={<Dashboard />} />
      <Route path="/update" element={<Update />} />
    </Routes>
  );
}
