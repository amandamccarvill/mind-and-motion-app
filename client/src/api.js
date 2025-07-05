// const BASE_URL = 'http://localhost:4000/api';
const BASE_URL = import.meta.env.VITE_API_KEY

export async function api(path, method = 'GET', body = null, token = null) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}