import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Dashboard', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('dashboard loads successfully', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.goto();

    // Check if dashboard is loaded
    const isLoaded = await dashboardPage.isLoaded();
    expect(isLoaded).toBe(true);
  });

  test('dashboard displays key widgets', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.goto();

    // Check for stats cards
    const statsCount = await dashboardPage.getStatsCount();
    expect(statsCount).toBeGreaterThan(0);
  });

  test('sidebar navigation works', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.goto();

    // Try navigating to employees section
    await dashboardPage.navigateToSection('Employees');
    await expect(page).toHaveURL(/\/admin\/employees/);
  });
});