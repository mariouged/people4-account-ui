import { ACCOUNT } from '../types/account';
import { httpRequest } from './http';

export async function signupApi({ ...signupFields }) {
  const result = {
    account: { ...ACCOUNT },
    message: '',
    ok: false,
  };
  const urlBase = import.meta.env.VITE_ACCOUNT_API_URL_BASE;
  const endpoint = '/signup';
  const res = await httpRequest(urlBase, endpoint, 'POST', signupFields, null);
  if (res.data.apiKey) {
    result.ok = true;
    result.message = 'OK';
    result.account = {
      ...ACCOUNT,
      email: signupFields.email,
      apiKey: res.data.apiKey,
      domain: res.data.domain,
      legalName: res.data.legalName,
      vatId: res.data.vatId,
    };
  } else {
    result.ok = false;
    result.message = res.message || 'Signup failed. Register account failed.';
  }
  return result;
}
