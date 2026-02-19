import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authentication', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
  await loginPage.login('SGadmin@gmail.com', 'TestPass123!');

  test('failed login shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginWithInvalidCredentials('invalid@email.com', 'wrongpassword');

    // Should stay on login page and show error
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('text=Login Failed')).toBeVisible();
  });
});