import { test, expect } from '@playwright/test';

// Prefer explicit frontend/backend env vars (allow testing production directly).
const BACKEND =
  process.env.REACT_APP_BACKEND_URL || process.env.VITE_BACKEND_URL || process.env.TEST_BACKEND_URL || 'http://localhost:8001';
const API_BASE = `${BACKEND.replace(/\/$/, '')}/api`;

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'SGadmin@gmail.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'TestPass123!';

test.describe('Auth API', () => {
  test('login with wrong credentials returns 401', async ({ request }) => {
    const resp = await request.post(`${API_BASE}/auth/login`, { data: { email: 'invalid@example.com', password: 'wrong' } });
    expect(resp.status()).toBe(401);
  });

  test('login with valid credentials returns 200 and token', async ({ request }) => {
    const resp = await request.post(`${API_BASE}/auth/login`, { data: { email: TEST_EMAIL, password: TEST_PASSWORD } });
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    const hasAuth = !!(body?.access_token || body?.token || body?.accessToken || body?.user);
    expect(hasAuth).toBeTruthy();
  });

  test('protected endpoint requires token and accepts valid token', async ({ request }) => {
    // Without token
    const noAuth = await request.get(`${API_BASE}/auth/me`);
    expect([401, 403]).toContain(noAuth.status());

    // Get token
    const login = await request.post(`${API_BASE}/auth/login`, { data: { email: TEST_EMAIL, password: TEST_PASSWORD } });
    expect(login.status()).toBe(200);
    const loginBody = await login.json();
    const token = loginBody?.access_token || loginBody?.token || loginBody?.accessToken || loginBody?.user?.token;
    expect(token).toBeTruthy();

    // With token
    const auth = await request.get(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    expect(auth.status()).toBe(200);
    const me = await auth.json();
    expect(me).toBeTruthy();
  });
});
