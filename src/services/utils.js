
export function hasAllSessionHeaders() {
  return getSessionItem('session_id') && getSessionItem('x_request_id') && getSessionItem('x_id');
}

export function getSessionItem(key) {
  if (!window.sessionStorage) {
    console.warn('sessionStorage is not available in this environment.');
    return null;
  }
  return sessionStorage.getItem(key);
}

export function setSessionItem(key, value) {
  if (!window.sessionStorage) {
    console.warn('sessionStorage is not available in this environment.');
    return;
  }
  sessionStorage.setItem(key, value);
}

export function generateBearerToken() {
  return getSessionItem('x_request_id') + '.' + getSessionItem('x_id');
}
