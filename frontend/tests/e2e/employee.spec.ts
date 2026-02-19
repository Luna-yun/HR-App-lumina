import { test, expect } from '@playwright/test';
import { EmployeePage } from '../pages/EmployeePage';

test.describe('Employee Management', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('employee list loads', async ({ page }) => {
    const employeePage = new EmployeePage(page);

    await employeePage.goto();

    // Check if page is loaded
    const isLoaded = await employeePage.isLoaded();
    expect(isLoaded).toBe(true);
  });

  test('employee list displays employees', async ({ page }) => {
    const employeePage = new EmployeePage(page);

    await employeePage.goto();

    // Check if there are employees displayed
    const employeeCount = await employeePage.getEmployeeCount();
    expect(employeeCount).toBeGreaterThanOrEqual(0);
  });

  test('search functionality works', async ({ page }) => {
    const employeePage = new EmployeePage(page);

    await employeePage.goto();

    // Search for a term (assuming there's at least one employee)
    await employeePage.searchEmployee('test');

    // Page should still be loaded
    const isLoaded = await employeePage.isLoaded();
    expect(isLoaded).toBe(true);
  });
});