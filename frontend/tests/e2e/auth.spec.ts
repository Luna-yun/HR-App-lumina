import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authentication', () => {
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

    // Should stay on login page and show error toast
    await expect(page).toHaveURL(/\/login/);
    // Wait for error toast to appear
    await expect(page.locator('[data-sonner-toast]')).toContainText('Login Failed');
  });
});