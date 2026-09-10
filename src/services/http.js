import { authenticationHeaders, headersToken } from './authentication';

export async function httpRequest(
  urlBase,
  path,
  method,
  payload,
  token
) {
  const result = {
    ok: false,
    message: '',
    data: null,
  }
  try {
    const endpoint = `${urlBase}${path}`;
    let headers = {};
    if (token) {
      // when user has authenticated and provided a token
      headers = headersToken(token);
    } else {
      // when user is guest
      headers = await authenticationHeaders();
    }
    const methodsAvailable = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    if (!methodsAvailable.includes(method.toUpperCase())) {
      console.error(`HTTP method ${method} is not supported`);
      throw new Error(`HTTP method ${method} is not supported`);
    }
    const options = {
      method,
      headers,
    };
    if (payload) {
      options.body = JSON.stringify(payload);
    }
    const response = await fetch(endpoint, options);
    const res = await response.json();
    result.ok = true;
    result.data = res;
  } catch (err) {
    console.error(err.message || 'HTTP request failed');
    result.message = err.message || 'HTTP request failed';
  }
  return result;
}
