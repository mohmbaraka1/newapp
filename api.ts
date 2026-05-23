const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(method: string, path: string, body?: any) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'حدث خطأ');
  return data;
}

export const authAPI = {
  register: (name: string, email: string, password: string, type = 'idea') =>
    request('POST', '/auth/register', { name, email, password, type }),
  login: (email: string, password: string) =>
    request('POST', '/auth/login', { email, password }),
  me: () => request('GET', '/auth/me'),
};

export const ideasAPI = {
  getAll: () => request('GET', '/ideas'),
  getMy: () => request('GET', '/ideas/my'),
  create: (data: { title: string; description: string; category: string; stage: string }) =>
    request('POST', '/ideas', data),
  update: (id: number, data: any) => request('PUT', `/ideas/${id}`, data),
  delete: (id: number) => request('DELETE', `/ideas/${id}`),
};

export function saveAuth(token: string, user: any) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

export function isLoggedIn() {
  return !!getToken();
}