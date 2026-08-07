import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/api';

const INITIAL = { legalName: '', vatId: '', domain: '', email: '', password: '' };

function validate(fields) {
  const errs = {};
  if (!fields.legalName.trim()) errs.legalName = 'Legal name is required';
  if (!fields.vatId.trim()) errs.vatId = 'VAT ID is required';
  if (!fields.domain.trim()) errs.domain = 'Domain is required';
  if (!fields.email.trim()) errs.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errs.email = 'Enter a valid email';
  if (!fields.password) errs.password = 'Password is required';
  else if (fields.password.length < 8)
    errs.password = 'Password must be at least 8 characters';
  return errs;
}

function SignupForm() {
  const [fields, setFields] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [apiMessage, setApiMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStatus('loading');
    setApiMessage('');
    try {
      const result = await signup(fields);
      setStatus('success');
      setApiMessage(result.message);
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err) {
      setStatus('error');
      setApiMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="card">
      <h2>Create Account</h2>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="legalName">Legal Name</label>
          <input
            id="legalName"
            name="legalName"
            type="text"
            value={fields.legalName}
            onChange={handleChange}
            className={errors.legalName ? 'error' : ''}
            placeholder="Acme Corp Ltd."
            aria-describedby={errors.legalName ? 'legalName-error' : undefined}
          />
          {errors.legalName && (
            <span id="legalName-error" className="field-error">{errors.legalName}</span>
          )}
        </div>

        <div className="field">
          <label htmlFor="vatId">VAT ID</label>
          <input
            id="vatId"
            name="vatId"
            type="text"
            value={fields.vatId}
            onChange={handleChange}
            className={errors.vatId ? 'error' : ''}
            placeholder="EU123456789"
            aria-describedby={errors.vatId ? 'vatId-error' : undefined}
          />
          {errors.vatId && (
            <span id="vatId-error" className="field-error">{errors.vatId}</span>
          )}
        </div>

        <div className="field">
          <label htmlFor="domain">Domain</label>
          <input
            id="domain"
            name="domain"
            type="text"
            value={fields.domain}
            onChange={handleChange}
            className={errors.domain ? 'error' : ''}
            placeholder="acme.com"
            aria-describedby={errors.domain ? 'domain-error' : undefined}
          />
          {errors.domain && (
            <span id="domain-error" className="field-error">{errors.domain}</span>
          )}
        </div>

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
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span id="email-error" className="field-error">{errors.email}</span>
          )}
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
            placeholder="Min. 8 characters"
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <span id="password-error" className="field-error">{errors.password}</span>
          )}
        </div>

        {status === 'success' && (
          <div className="alert alert-success" role="alert">{apiMessage}</div>
        )}
        {status === 'error' && (
          <div className="alert alert-error" role="alert">{apiMessage}</div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
      <p className="form-footer">
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </div>
  );
}

export default SignupForm;
