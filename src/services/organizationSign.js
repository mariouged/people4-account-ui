import { hasAllSessionHeaders, generateBearerToken, getSessionItem } from './utils';
import { authenticationHeaders } from './authentication';

const organizationStruct = {
  domain: '',
  legalName: '',
  vatId: '',
};

export async function organizationSign({ ...organization }) {
  const result = {
    organization: null,
    message: '',
  };
  if (!organization.domain || !organization.legalName || !organization.vatId) {
    result.message = 'Missing required organization fields';
    return result;
  }
  const authHeaders = await authenticationHeaders();
  try {
    const response = await fetch(`${import.meta.env.VITE_ACCOUNT_API_URL_BASE}/sign/organization`, {
      method: 'PUT',
      headers: { ...authHeaders },
      body: JSON.stringify({ ...organization }),
    });
    const res = await response.json();
    if (res.domain && res.legalName && res.vatId) {
      result.organization = { ...res };
      result.message = 'OK';
    }
  } catch (err) {
    console.error(err.message || 'sign Organization failed');
    result.message = 'sign Organization failed';
  }
  return result;
}
