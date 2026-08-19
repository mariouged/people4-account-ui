import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyTwoFactor, createTwoFactor, getSessionStorageItem, signup, signin } from '../services/api';

function TwoFactorForm() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Code is required');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const resultCreateTwoFactor = await createTwoFactor();
      if (!resultCreateTwoFactor.success) {
        setStatus('error');
        setError(resultCreateTwoFactor.message || 'Failed to create two-factor authentication. Please try again.');
        return;
      }
      const resTwoFactor = await verifyTwoFactor({ code });
      if (!resTwoFactor.success) {
        setStatus('error');
        setError(resTwoFactor.message || 'Verification failed. Please try again.');
        return;
      }
      const conversionFunnel = getSessionStorageItem('conversionFunnel');
      if (conversionFunnel === 'signin') {
        const result = await signin({
          email: getSessionStorageItem('email'),
          password: getSessionStorageItem('hashpass'),
        });
        if (result.token) {
          navigate('/dashboard');
          return;
        } else {
          setStatus('error');
          setError(result.message || 'Sign in failed. Please try again.');
          return;
        }
      }
      if (conversionFunnel === 'signup') {
        const signupFields = JSON.parse(getSessionStorageItem('signupFields') || '{}');
        const { legalName, vatId, domain, email, password } = signupFields;
        const fields = { legalName, vatId, domain, email, password };
        const result = await signup(fields);
        if (result.apiKey) {
          navigate('/dashboard');
          return;
        } else {
          setStatus('error');
          setError(result.message || 'Sign up failed. Please try again.');
          return;
        }
      }
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Verification failed. Please try again.');
    }
  };

  return (
    <div className="card">
      <h2>Two-Factor Authentication</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Enter the 6-digit code sent to your email, notification, or 2FA app.
      </p>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="code">Verification Code</label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); }}
            className={error ? 'error' : ''}
            placeholder="123456"
          />
          {error && <span className="field-error">{error}</span>}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Verifying…' : 'Verify'}
        </button>
      </form>
    </div>
  );
}

export default TwoFactorForm;
