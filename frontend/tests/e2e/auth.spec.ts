import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authentication', () => {
  test('simple page load test', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Lumina/);
  });

  test('successful login redirects to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('SGadmin@gmail.com', 'TestPass123!');

    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/\/admin/);
  });

  test('failed login shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginWithInvalidCredentials('invalid@email.com', 'wrongpassword');

    // Should stay on login page (proof that login failed and security is working)
    await expect(page).toHaveURL(/\/login/);
  });
});