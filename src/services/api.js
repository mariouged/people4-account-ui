/* Mock API service — replace with real account-api fetch calls when available */

const MOCK_DELAY_MS = 600;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function signup({ legalName, vatId, domain, email, password }) {
  if (!hasHeadersAndCookies()) {
    const err = new Error('Invalid code. H0-01');
    err.status = 400;
    throw err;
  }
  let success = false;
  let apiKey = null;
  let message = 'Create account failed. Please retry.';
  try {
    const BearerToken = generateBearerToken();
    const response = await fetch(`${import.meta.env.VITE_ACCOUNT_API_URL_BASE}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BearerToken}`,
        'X-Session-Id': getSessionStorageItem('session_id') || '',
      },
      body: JSON.stringify({
        domain,
        legalName,
        vatId,
        email,
        password,
      }),
    });
    const res = await response.json();
    if (res.apiKey) {
      setSessionStorageItem('apiKey', res.apiKey);
      apiKey = res.apiKey;
      success = true;
      message = 'Account created successfully. Please check your email for verification.';
    }
  } catch (err) {
    console.error(err.message || 'signup failed');
    err.status = err.status || 401;
    throw err;
  }

  return { success, apiKey, message };
}

export async function signin({ email, password }) {
  if (!hasHeadersAndCookies()) {
    const err = new Error('Invalid code. H0-01');
    err.status = 400;
    throw err;
  }
  let token = '';
  try {
    const BearerToken = generateBearerToken();
    const response = await fetch(`${import.meta.env.VITE_ACCOUNT_API_URL_BASE}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BearerToken}`,
        'X-Session-Id': getSessionStorageItem('session_id') || '',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const res = await response.json();
    if (res.token) {
      token = res.token;
    }
  } catch (err) {
    console.error(err.message || 'signin failed');
    err.status = err.status || 401;
    throw err;
  }

  return { token };
}

export async function verifyTwoFactor({ code }) {
  if (!hasHeadersAndCookies()) {
    const err = new Error('Invalid code. H0-01');
    err.status = 400;
    throw err;
  }
  if (!/^\d{6}$/.test(code)) {
    const err = new Error('Invalid code. Enter the 6-digit code.');
    err.status = 400;
    throw err;
  }
  let success = false;
  try {
    const BearerToken = generateBearerToken();
    const response = await fetch(`${import.meta.env.VITE_ACCOUNT_API_URL_BASE}/verifyTwoFactor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BearerToken}`,
        'X-Session-Id': getSessionStorageItem('session_id') || '',
      },
      body: JSON.stringify({
        code: code,
        email: getSessionStorageItem('email') || '',
      }),
    });
    const res = await response.json();
    if (res.success) {
      success = true;
      // TODO setSessionStorageItem('token', res.token);
    }
  } catch (err) {
    console.error(err.message || 'signin failed');
    err.status = err.status || 401;
    throw err;
  }
  return { success, token: getSessionStorageItem('token') || 'mock-jwt-token-authenticated' };
}

async function mainHeadersAndCookies() {
  if (!hasHeadersAndCookies()) {
    const headersAndCookies = await fetchHeadersAndCookies();
    setSessionStorageItem('session_id', headersAndCookies.session_id);
    setSessionStorageItem('x_request_id', headersAndCookies.x_request_id);
    setSessionStorageItem('x_id', headersAndCookies.id);
  }
}

export function hasHeadersAndCookies() {
  return getSessionStorageItem('session_id') && getSessionStorageItem('x_request_id') && getSessionStorageItem('x_id');
}

export function getSessionStorageItem(key) {
  if (!window.sessionStorage) {
    console.warn('sessionStorage is not available in this environment.');
    return null;
  }
  return sessionStorage.getItem(key);
}

export function setSessionStorageItem(key, value) {
  if (!window.sessionStorage) {
    console.warn('sessionStorage is not available in this environment.');
    return;
  }
  sessionStorage.setItem(key, value);
}

async function fetchHeadersAndCookies() {
  try {
    const response = await fetch(`${import.meta.env.VITE_ACCOUNT_API_URL_BASE}/headersAndCookies`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    const headersAndCookies = await response.json();
    if (!headersAndCookies.session_id || !headersAndCookies.x_request_id || !headersAndCookies.id) {
      throw new Error('Missing required headers or cookies in response');
    }
    return headersAndCookies;
  } catch (err) {
    console.error(err.message || 'fetch headers and cookies failed');
    throw err;
  }
}

function generateBearerToken() {
  return getSessionStorageItem('x_request_id') + '.' + getSessionStorageItem('x_id');
}

export async function createTwoFactor() {
  await mainHeadersAndCookies();
  const email = getSessionStorageItem('email');
  if (!email) {
    const err = new Error('Email is required');
    err.status = 400;
    throw err;
  }
  let success = false;
  try {
    const BearerToken = generateBearerToken();
    const response = await fetch(`${import.meta.env.VITE_ACCOUNT_API_URL_BASE}/createTwoFactor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BearerToken}`,
        'X-Session-Id': getSessionStorageItem('session_id') || '',
      },
      body: JSON.stringify({
        email
      }),
    });
    const res = await response.json();
    if (res.codeMock) {
      success = true;
      setSessionStorageItem('codeMock', res.codeMock);
    }
  } catch (err) {
    console.error(err.message || 'createTwoFactor failed');
    err.status = err.status || 401;
    throw err;
  }
  return { success, codeMock: getSessionStorageItem('codeMock') || 'error' };
}