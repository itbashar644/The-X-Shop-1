import { API_BASE_URL } from "@/types/variables";
 

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Ошибка входа');
  return res.json(); // { user, token }
}

export async function register(email: string, password: string, name?: string) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Ошибка регистрации');
  return res.json(); // { user, token }
}

export async function getMe(token: string) {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Не авторизован');
  return res.json(); // { user }
} 

 