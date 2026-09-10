import { ACCOUNT } from '../types/account';
import { httpRequest } from './http';

export async function signoutApi({ account }) {
  const result = {
    ok: false,
    message: '',
  };
  const urlBase = import.meta.env.VITE_ACCOUNT_API_URL_BASE;
  const endpoint = `/signout`;
  const res = await httpRequest(urlBase, endpoint, 'DELETE', null, account.token);
  if (res.ok) {
    result.ok = true;
    result.message = 'OK';
  } else {
    result.message = res.message || 'Signout failed.';
  }
  return result;
}
