import { hasAllSessionHeaders, setSessionItem, getSessionItem } from './utils';
import { ACCOUNT } from '../types/account';

export async function authenticationHeaders() {
  if (!hasAllSessionHeaders()) {
    const headersAndCookies = await headersAndCookiesGenerate();
    setSessionItem('session_id', headersAndCookies.session_id);
    setSessionItem('x_request_id', headersAndCookies.x_request_id);
    setSessionItem('x_id', headersAndCookies.id);
  }
  if (!hasAllSessionHeaders()) {
    throw new Error('Missing required session headers');
  }
  const bearer = getSessionItem('x_request_id') + '.' + getSessionItem('x_id');
  const x_session_id = getSessionItem('session_id');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${bearer}`,
    'X-Session-Id': x_session_id,
  };
}

async function headersAndCookiesGenerate() {
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

export async function fetchToken({ account, setAccount }) {
  if (account.token) {
    return account.token;
  }
  let resultToken = '';
  if (!account.apiKey || !account.domain || !account.legalName || !account.vatId) {
    const err = new Error('Account properties are required');
    err.status = 500;
    throw err;
  }
  try {
    const endpoint = `${import.meta.env.VITE_AUTH_API_URL_BASE}/token`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${account.apiKey}`,
    };
    const payload = {
      domain: account.domain || '',
      legalName: account.legalName || '',
      vatId: account.vatId || '',
    };
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(payload),
    });
    const res = await response.json();
    if (res.token) {
      setAccount({
        ...ACCOUNT,
        ...account,
        token: res.token
      });
      resultToken = res.token;
    }
  } catch (err) {
    console.error(err.message || 'token retrieve failed');
    err.status = err.status || 401;
    throw err;
  }
  return resultToken;
}

export function headersToken(token) {
  return {
    'Authorization': `Bearer ${token}`,
  };
}