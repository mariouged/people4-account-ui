/* Mock API service — replace with real account-api fetch calls when available */

const MOCK_DELAY_MS = 600;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function signup({ legalName, vatId, domain, email, password }) {
  await mainHeadersAndCookies();

  let success = false, message = 'Create account failed. Please retry.'
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
      success = true;
      message = 'Account created successfully. Please check your email for verification.';
    }
  } catch (err) {
    console.error(err.message || 'signup failed');
    err.status = err.status || 401;
    throw err;
  }

  return { success, message };
}

export async function signin({ email, password }) {
  await mainHeadersAndCookies();

  let success = false, requiresTwoFactor = false;
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
      success = true;
      requiresTwoFactor = true;
      setSessionStorageItem('token', res.token);
    }
  } catch (err) {
    console.error(err.message || 'signin failed');
    err.status = err.status || 401;
    throw err;
  }

  return { success, requiresTwoFactor };
}

export async function verifyTwoFactor({ code }) {
  await delay(MOCK_DELAY_MS);
  if (!/^\d{6}$/.test(code)) {
    const err = new Error('Invalid code. Enter the 6-digit code.');
    err.status = 400;
    throw err;
  }
  return { success: true, token: 'mock-jwt-token-authenticated' };
}

async function mainHeadersAndCookies() {
  const hasHeadersAndCookies = getSessionStorageItem('session_id') && getSessionStorageItem('x_request_id') && getSessionStorageItem('x_id');
  if (!hasHeadersAndCookies) {
    const headersAndCookies = await fetchHeadersAndCookies();
    setSessionStorageItem('session_id', headersAndCookies.session_id);
    setSessionStorageItem('x_request_id', headersAndCookies.x_request_id);
    setSessionStorageItem('x_id', headersAndCookies.id);
  }
}

function getSessionStorageItem(key) {
  if (!window.sessionStorage) {
    console.warn('sessionStorage is not available in this environment.');
    return null;
  }
  return sessionStorage.getItem(key);
}

function setSessionStorageItem(key, value) {
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
