import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signin } from '../services/api';

function SigninForm() {
  const [fields, setFields] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [apiMessage, setApiMessage] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!fields.email.trim()) errs.email = 'Email is required';
    if (!fields.password) errs.password = 'Password is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStatus('loading');
    setApiMessage('');
    try {
      const result = await signin(fields);
      if (result.requiresTwoFactor) {
        navigate('/two-factor');
      }
    } catch (err) {
      setStatus('error');
      setApiMessage(err.message || 'Sign in failed. Please try again.');
    }
  };

  return (
    <div className="card">
      <h2>Sign In</h2>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={fields.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="admin@acme.com"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={fields.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            placeholder="Your password"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        {status === 'error' && (
          <div className="alert alert-error" role="alert">{apiMessage}</div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <p className="form-footer">
        No account yet? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
}

export default SigninForm;
