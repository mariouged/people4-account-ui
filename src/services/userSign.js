import { authenticationHeaders } from './authentication';
import { setSessionItem } from './utils';

export async function userSign({ email, password }) {
  const result = {
    message: '',
    ok: false,
  };
  if (!email || !password) {
    result.message = 'Missing required user fields';
    return result;
  }
  const payload = { email, password }; 
  const authHeaders = await authenticationHeaders();
  try {
    const endpoint = `${import.meta.env.VITE_ACCOUNT_API_URL_BASE}/signin`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { ...authHeaders },
      body: JSON.stringify(payload),
    });
    const res = await response.json();
    if (res.apiKey) {
      setSessionItem('apiKey', res.apiKey);
      result.message = 'OK';
      result.ok = true;
      result.account = { 
        email: email,
        apiKey: res.apiKey,
        domain: res.domain,
        legalName: res.legalName,
        vatId: res.vatId,
      };
    }
  } catch (err) {
    console.error(err.message || 'sign User failed');
    result.message = 'sign User failed';
    result.ok = false;
  }
  return result;
}
