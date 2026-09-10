import { headersToken, fetchToken } from './authentication';
import { httpRequest } from './http';

export async function fetchInvoices({ account, setAccount }) {
  const result = {
    invoices: [],
    message: '',
    ok: false,
  }
  let token = account.token;
  if (!account.token) {
    token = await fetchToken({ account, setAccount });
  }
  const urlBase = import.meta.env.VITE_INVOICE_API_URL_BASE;
  const endpoint = '/invoice/v1';
  const res = await httpRequest(urlBase, endpoint, 'GET', null, token);
  if (res.ok) {
    result.invoices = Array.isArray(res.data) ? res.data : [];
    result.ok = true;
  } else {
    result.message = res.message || 'Fetch invoices failed.';
  }
  return result;
}
