import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import SigninForm from './components/SigninForm';
import TwoFactorForm from './components/TwoFactorForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter basename="/account-ui">
      <div className="app">
        <header className="app-header">
          <h1>Simply Compliance</h1>
          <nav>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="/signin" element={<SigninForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/two-factor" element={<TwoFactorForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
