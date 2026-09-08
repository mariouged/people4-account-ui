import { hasAllSessionHeaders, generateBearerToken, getSessionItem } from './utils';

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
  if (!hasAllSessionHeaders()) {
    result.message = 'Invalid session headers. H0-01';
    return result;
  }
  try {
    const response = await fetch(`${import.meta.env.VITE_ACCOUNT_API_URL_BASE}/organization`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${generateBearerToken()}`,
        'X-Session-Id': getSessionItem('session_id') || '',
      },
      body: JSON.stringify({ ...organization }),
    });
    const res = await response.json();
    if (res.organization && Object.keys(res.organization).length > 0) {
      result.organization = res.organization;
    }
  } catch (err) {
    console.error(err.message || 'sign Organization failed');
    result.message = 'sign Organization failed';
  }
  return result;
}
