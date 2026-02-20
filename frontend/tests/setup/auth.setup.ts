import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const authFile = 'playwright/.auth/user.json';

setup.use({ browserName: 'firefox' });

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await page.goto('/login');

  // Login with test credentials (driven by env for determinism)
  const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'SGadmin@gmail.com';
  const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'TestPass123!';
  await loginPage.login(TEST_EMAIL, TEST_PASSWORD);

  // Wait for navigation to dashboard
  await page.waitForURL(/\/(admin|employee)/);

  // Save authentication state
  await page.context().storageState({ path: authFile });
});