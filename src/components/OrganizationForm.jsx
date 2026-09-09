import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { organizationSign } from '../services/organizationSign';

const INITIAL = { domain: '', legalName: '', vatId: '' };

function validate(fields) {
  const errs = {};
  if (!fields.domain.trim()) errs.domain = 'Domain is required';
  if (!fields.legalName.trim()) errs.legalName = 'Legal name is required';
  if (!fields.vatId.trim()) errs.vatId = 'VAT ID is required';
  return errs;
}

function OrganizationForm() {
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
    const result = await organizationSign(fields)
    if (result.ok) {
      setStatus('success');
      navigate('/signin');
    } else {
      setStatus('error');
      console.error('Organization sign failed:', result);
      setApiMessage('Organization sign failed.');
    }
  };

  return (
    <div className="card">
      <h2>Organization Details</h2>
      <form className="form" onSubmit={handleSubmit} noValidate autoComplete="on">

        <div className="field">
          <label htmlFor="domain">Domain</label>
          <input
            id="domain"
            name="domain"
            type="text"
            value={fields.domain}
            onChange={handleChange}
            className={errors.domain ? 'error' : ''}
            placeholder="example.com"
            aria-describedby={errors.domain ? 'domain-error' : undefined}
          />
          {errors.domain && (
            <span id="domain-error" className="field-error">{errors.domain}</span>
          )}
        </div>

        <div className="field">
          <label htmlFor="legalName">Legal Name</label>
          <input
            id="legalName"
            name="legalName"
            type="text"
            value={fields.legalName}
            onChange={handleChange}
            className={errors.legalName ? 'error' : ''}
            placeholder="Example Corp Ltd."
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
          {status === 'loading' ? 'Loading...' : 'Login'}
        </button>
      </form>
      <p className="form-footer">
        No account yet? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
}

export default OrganizationForm;
