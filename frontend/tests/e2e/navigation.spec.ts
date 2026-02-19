import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('unauthenticated user redirected to login', async ({ page }) => {
    // Try to access protected route
    await page.goto('/admin');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user can access protected routes', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('#email', 'SGadmin@gmail.com');
    await page.fill('#password', 'TestPass123!');
    await page.click('button[type="submit"]');

    // Should be redirected to dashboard
    await expect(page).toHaveURL(/\/admin/);

    // Try accessing employee page
    await page.goto('/admin/employees');
    await expect(page).toHaveURL(/\/admin\/employees/);
  });

  test('sidebar navigation works', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('#email', 'SGadmin@gmail.com');
    await page.fill('#password', 'TestPass123!');
    await page.click('button[type="submit"]');

    // Navigate using sidebar
    await page.locator('nav').locator('text=Employees').click();
    await expect(page).toHaveURL(/\/admin\/employees/);
  });
});