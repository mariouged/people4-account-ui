export const SIGNUP_FIELDS = {
    domain: '',
    legalName: '',
    vatId: '',
    email: '',
    password: ''
}

export function validateSignupFields(fields) {
    const errs = {};
    if (!fields.domain.trim()) errs.domain = 'Domain is required';
    if (!fields.legalName.trim()) errs.legalName = 'Legal name is required';
    if (!fields.vatId.trim()) errs.vatId = 'VAT ID is required';
    if (!fields.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
        errs.email = 'Enter a valid email';
    const emailDomain = fields.email.split('@')[1] || '';
    if (fields.domain.trim() !== emailDomain) errs.email = 'Email must match domain';
    if (!fields.password) errs.password = 'Password is required';
    else if (fields.password.length < 8)
        errs.password = 'Password must be at least 8 characters';
    return errs;
}
