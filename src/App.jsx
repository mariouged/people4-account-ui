import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import SigninForm from './components/SigninForm';
import TwoFactorForm from './components/TwoFactorForm';
import Dashboard from './components/Dashboard';
import { headersAndCookiesGenerate } from './services/api';

function App() {

  const initHeadersAndCookies = async () => {
    // Initialize headers and cookies for API requests if needed
    // This can include setting default headers, tokens, etc.
    try {
      // TODO response
      await headersAndCookiesGenerate({ "headers": "", "cookies": "" });
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Verification failed. Please try again.');
    }
  };

  initHeadersAndCookies();

  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <h1>Easy Compliance</h1>
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
