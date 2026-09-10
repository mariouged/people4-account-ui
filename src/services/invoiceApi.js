import { headersToken, fetchToken } from './authentication';

export async function fetchInvoices({ account, setAccount }) {
  const result = {
    invoices: [],
    message: '',
    ok: false,
  }
  let token = '';
  try {
    token = await fetchToken({ account, setAccount });
  } catch (err) {
    console.error(err.message || 'fetch token failed');
    result.message = 'fetch token failed';
    return result;
  }
  try {
    const path = '/invoice/v1';
    const endpoint = `${import.meta.env.VITE_INVOICE_API_URL_BASE}${path}`;
    const response = await fetch(endpoint, {
      headers: headersToken(token),
    });
    const res = await response.json();
    result.invoices = Array.isArray(res) ? res : [];
    result.ok = true;
  } catch (err) {
    console.error(err.message || 'fetch invoices failed');
    result.message = 'fetch invoices failed';
  }
  return result;
}