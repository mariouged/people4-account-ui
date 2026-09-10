import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import OrganizationForm from './components/OrganizationForm';
import NavMenu from './components/NavMenu';
import NavSign from './components/NavSign';
import { useState } from 'react';
import SignUpForm from './components/SignUpForm';
import SigninForm from './components/SigninForm';
import SignOut from './components/SignOut';
import Dashboard from './components/Dashboard';

function App() {
  const [account, setAccount] = useState(null); // TODO refactor to Context

  return (
    <BrowserRouter basename="/account-ui">
      <div className="app">
        <header className="app-header">
          <h1>Simply Compliance</h1>
          <nav>
            {account ? (
              <NavMenu />
            ) : (
              <NavSign />
            )}
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="/sign/organization" element={<OrganizationForm />} />
            <Route path="/signin" element={<SigninForm account={account} setAccount={setAccount} />} />
            <Route path="/signup" element={<SignUpForm account={account} setAccount={setAccount} />} />
            <Route path="/signout" element={<SignOut account={account} setAccount={setAccount} />} />
            <Route path="/dashboard" element={<Dashboard account={account} setAccount={setAccount} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
