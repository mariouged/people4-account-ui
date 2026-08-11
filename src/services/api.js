/* Mock API service — replace with real account-api fetch calls when available */

const ACCOUNT_API_HOST = import.meta.env.VITE_ACCOUNT_API_HOST || 'localhost';
const ACCOUNT_API_PORT = import.meta.env.VITE_ACCOUNT_API_PORT || '8080';

const MOCK_DELAY_MS = 600;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function signup({ legalName, vatId, domain, email, password }) {
  await delay(MOCK_DELAY_MS);
  if (email === 'taken@example.com') {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }
  return { success: true, message: 'Account created. Please sign in.' };
}

export async function signin({ email, password }) {
  // TODO move into a separate function
  const session_id = readCookie('session_id');
  if (!session_id || !getAuthenticationXToken()) {
    const headersAndCookies = await fetchHeadersAndCookies();
    setCookie('session_id', headersAndCookies.session_id);
    setAuthenticationXToken(headersAndCookies);
  }
  // TODO: Replace with real API call to account-api
  await delay(MOCK_DELAY_MS);
  if (email === 'wrong@example.com') {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  return { success: true, requiresTwoFactor: true };
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

function readCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

function setCookie(name, value) {
  const expires = new Date(Date.now() + 3600 * 1000).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getAuthenticationXToken() {
  return sessionStorage.getItem('x_token');
}

function setAuthenticationXToken(headersAndCookies) {
  // Store the token in localStorage or a cookie for future API requests
  const x_token = headersAndCookies.x_request_id + '.' + headersAndCookies.id;
  sessionStorage.setItem('x_token', x_token);
}

async function fetchHeadersAndCookies() {
  console.log(`API Host: ${ACCOUNT_API_HOST}, API Port: ${ACCOUNT_API_PORT}`);
  try {
    // TODO FIX CORS
    const response = await fetch(`http://${ACCOUNT_API_HOST}:${ACCOUNT_API_PORT}/headersAndCookies`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    console.log('Headers and cookies fetched:', data);
    return data;
  } catch (err) {
    setStatus('error');
    setError(err.message || 'fetch headers and cookies failed');
  }
}
