/**
 * Thin fetch wrapper that attaches the auth token from sessionStorage.
 * For all /api/* calls.
 */
export async function apiFetch(path, options = {}) {
  const token = sessionStorage.getItem('pd_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(path, { ...options, headers, credentials: 'include' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  get:    (path)         => apiFetch(path),
  post:   (path, data)   => apiFetch(path, { method: 'POST',  body: JSON.stringify(data) }),
  patch:  (path, data)   => apiFetch(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (path)         => apiFetch(path, { method: 'DELETE' }),
};
