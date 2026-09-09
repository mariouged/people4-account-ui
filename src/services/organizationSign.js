import { authenticationHeaders } from './authentication';
import { setSessionItem } from './utils';

export async function organizationSign({ ...organization }) {
  const result = {
    organization: null,
    message: '',
    ok: false,
  };
  if (!organization.domain || !organization.legalName || !organization.vatId) {
    result.message = 'Missing required organization fields';
    return result;
  }
  const authHeaders = await authenticationHeaders();
  try {
    const endpoint = `${import.meta.env.VITE_ACCOUNT_API_URL_BASE}/sign/organization`;
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: { ...authHeaders },
      body: JSON.stringify({ ...organization }),
    });
    const res = await response.json();
    if (res.domain && res.legalName && res.vatId) {
      setSessionItem('domain', res.domain);
      setSessionItem('legalName', res.legalName);
      setSessionItem('vatId', res.vatId);
      result.message = 'OK';
      result.ok = true;
    }
  } catch (err) {
    console.error(err.message || 'sign Organization failed');
    result.message = 'sign Organization failed';
    result.ok = false;
  }
  return result;
}
