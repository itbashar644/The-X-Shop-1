import { API_BASE_URL } from "@/types/variables";

export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Ошибка запроса');
  return res.json(); // { message, token }
}

export async function resetPassword(token: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Ошибка сброса');
  return res.json(); // { message }
} 