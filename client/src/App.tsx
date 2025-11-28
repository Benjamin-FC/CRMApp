import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CustomerInfo from './components/CustomerInfo';
import './index.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('authToken');
  return token ? <>{children}</> : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/customer"
            element={
              <ProtectedRoute>
                <CustomerInfo />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

