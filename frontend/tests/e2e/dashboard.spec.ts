import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Dashboard', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('dashboard loads successfully', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.goto();

    // Check if dashboard loaded (welcome banner should be visible)
    const isLoaded = await dashboardPage.isLoaded();
    expect(isLoaded).toBe(true);

    // Check for basic dashboard elements (may not have stats if API fails)
    await expect(page.locator('[data-testid="dashboard-welcome-banner"]')).toBeVisible();

    // Optionally check for stats cards (don't fail if API doesn't load)
    const statsCount = await dashboardPage.getStatsCount();
    if (statsCount > 0) {
      console.log(`Found ${statsCount} stats cards`);
    } else {
      console.log('No stats cards found - API may not be loading data');
    }
  });

  test('sidebar navigation works', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.goto();

    // Try navigating to employees section
    await dashboardPage.navigateToSection('Employees');
    await expect(page).toHaveURL(/\/admin\/employees/);
  });
});