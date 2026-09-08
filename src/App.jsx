import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import NavMenu from './components/NavMenu';
import NavSign from './components/NavSign';
import { useContext } from 'react';
import SignupForm from './components/SignupForm';
import SigninForm from './components/SigninForm';
import SignOut from './components/SignOut';
import TwoFactorForm from './components/TwoFactorForm';
import Dashboard from './components/Dashboard';
import { AuthenticatedContext } from './context/AuthenticatedContext';

function App() {
  const isAuthenticated = useContext(AuthenticatedContext);

  return (
    <BrowserRouter basename="/account-ui">
      <div className="app">
        <header className="app-header">
          <h1>Simply Compliance</h1>
          <nav>
            {isAuthenticated ? (
              <NavMenu />
            ) : (
              <NavSign />
            )}
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="/signin" element={<SigninForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/signout" element={<SignOut />} />
            <Route path="/two-factor" element={<TwoFactorForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
