/* Mock API service — replace with real account-api fetch calls when available */

const ACCOUNT_API_HOST = import.meta.env.VITE_ACCOUNT_API_HOST || 'localhost';
const ACCOUNT_API_PORT = import.meta.env.VITE_ACCOUNT_API_PORT || '8080';

const MOCK_DELAY_MS = 600;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function signup({ legalName, vatId, domain, email, password }) {
  // TODO: Replace with real API call to account-api
  console.log(`API Host: ${ACCOUNT_API_HOST}, API Port: ${ACCOUNT_API_PORT}`);
  await delay(MOCK_DELAY_MS);
  if (email === 'taken@example.com') {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }
  return { success: true, message: 'Account created. Please sign in.' };
}

export async function signin({ email, password }) {
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

export async function headersAndCookiesGenerate({ headers, cookies }) {
  await delay(MOCK_DELAY_MS);
  // Mock implementation — replace with real headers and cookies generation logic
  // TODO fetch
  // PUT http://${ACCOUNT_API_HOST}:${PORT}/headersAndCookies
  return { success: true, token: 'mock-jwt-token-authenticated' };
}
