const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function getToken() {
  return localStorage.getItem('fm_token');
}

function setToken(token: string | null) {
  if (token) localStorage.setItem('fm_token', token);
  else localStorage.removeItem('fm_token');
}

async function request(path: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers || {} as Record<string, string>),
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, Object.assign({}, opts, { headers }));
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = (data && data.error) || res.statusText || 'Request failed';
    throw new Error(err);
  }
  return data;
}

// Auth
export async function apiRegister(payload: { name: string; email: string; password: string; phone?: string }) {
  const data = await request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  if (data?.token) setToken(data.token);
  return data;
}

export async function apiLogin(payload: { email: string; password: string }) {
  const data = await request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  if (data?.token) setToken(data.token);
  return data;
}

export function apiLogout() {
  setToken(null);
}

// Generic collection helpers
export async function apiList(collection: string) {
  return await request(`/api/${collection}`);
}

export async function apiGet(collection: string, id: string) {
  return await request(`/api/${collection}/${id}`);
}

export async function apiCreate(collection: string, body: any) {
  return await request(`/${collection === 'items' ? 'items' : `api/${collection}`}`.replace('//', '/'), { method: 'POST', body: JSON.stringify(body) });
}

// Specific helpers
export async function createItem(body: any) {
  return await request('/items', { method: 'POST', body: JSON.stringify(body) });
}

export async function createClaim(body: any) {
  return await request('/claims', { method: 'POST', body: JSON.stringify(body) });
}

export async function createMessage(body: any) {
  return await request('/messages', { method: 'POST', body: JSON.stringify(body) });
}

export default {
  apiRegister,
  apiLogin,
  apiLogout,
  apiList,
  apiGet,
  apiCreate,
  createItem,
  createClaim,
  createMessage,
};
