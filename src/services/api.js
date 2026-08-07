/* Mock API service — replace with real account-api fetch calls when available */

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
