import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await page.goto('/login');

  // Login with test credentials
  await loginPage.login('testadmin@luminahr.com', 'TestPass123!');

  // Wait for navigation to dashboard
  await page.waitForURL(/\/(admin|employee)/);

  // Save authentication state
  await page.context().storageState({ path: authFile });
});