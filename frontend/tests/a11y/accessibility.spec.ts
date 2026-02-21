import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

/**
 * Accessibility Audit Tests
 * 
 * These tests scan pages for WCAG 2.1 violations using axe-core.
 * Violations are reported but do NOT fail the build.
 * This allows teams to track accessibility improvements over time.
 * 
 * Run: npm run test:accessibility
 */

test.describe('Accessibility Audits', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('login page accessibility', async ({ page }) => {
    await page.goto('/login');
    await injectAxe(page);
    
    const violations = await getViolations(page);
    if (violations.length > 0) {
      console.log(`\n[A11Y] Login Page - ${violations.length} accessibility issue(s) found`);
      violations.forEach((v) => {
        console.log(`  - ${v.id}: ${v.help}`);
      });
    } else {
      console.log('\n[A11Y] Login Page - ✓ No violations found');
    }
  });

  test('admin dashboard accessibility', async ({ page }) => {
    await page.goto('/admin');
    await injectAxe(page);
    
    const violations = await getViolations(page);
    if (violations.length > 0) {
      console.log(`\n[A11Y] Admin Dashboard - ${violations.length} accessibility issue(s) found`);
      violations.forEach((v) => {
        console.log(`  - ${v.id}: ${v.help}`);
      });
    } else {
      console.log('\n[A11Y] Admin Dashboard - ✓ No violations found');
    }
  });

  test('employee dashboard accessibility', async ({ page }) => {
    await page.goto('/employee');
    await injectAxe(page);
    
    const violations = await getViolations(page);
    if (violations.length > 0) {
      console.log(`\n[A11Y] Employee Dashboard - ${violations.length} accessibility issue(s) found`);
      violations.forEach((v) => {
        console.log(`  - ${v.id}: ${v.help}`);
      });
    } else {
      console.log('\n[A11Y] Employee Dashboard - ✓ No violations found');
    }
  });

  test('employee leave management accessibility', async ({ page }) => {
    await page.goto('/employee/leave');
    await injectAxe(page);
    
    const violations = await getViolations(page);
    if (violations.length > 0) {
      console.log(`\n[A11Y] Employee Leave - ${violations.length} accessibility issue(s) found`);
      violations.forEach((v) => {
        console.log(`  - ${v.id}: ${v.help}`);
      });
    } else {
      console.log('\n[A11Y] Employee Leave - ✓ No violations found');
    }
  });

  test('admin employees management accessibility', async ({ page }) => {
    await page.goto('/admin/employees');
    await injectAxe(page);
    
    const violations = await getViolations(page);
    if (violations.length > 0) {
      console.log(`\n[A11Y] Admin Employees - ${violations.length} accessibility issue(s) found`);
      violations.forEach((v) => {
        console.log(`  - ${v.id}: ${v.help}`);
      });
    } else {
      console.log('\n[A11Y] Admin Employees - ✓ No violations found');
    }
  });

  test('admin attendance accessibility', async ({ page }) => {
    await page.goto('/admin/attendance');
    await injectAxe(page);
    
    const violations = await getViolations(page);
    if (violations.length > 0) {
      console.log(`\n[A11Y] Admin Attendance - ${violations.length} accessibility issue(s) found`);
      violations.forEach((v) => {
        console.log(`  - ${v.id}: ${v.help}`);
      });
    } else {
      console.log('\n[A11Y] Admin Attendance - ✓ No violations found');
    }
  });

  test('admin analytics accessibility', async ({ page }) => {
    await page.goto('/admin/analytics');
    await injectAxe(page);
    
    const violations = await getViolations(page);
    if (violations.length > 0) {
      console.log(`\n[A11Y] Admin Analytics - ${violations.length} accessibility issue(s) found`);
      violations.forEach((v) => {
        console.log(`  - ${v.id}: ${v.help}`);
      });
    } else {
      console.log('\n[A11Y] Admin Analytics - ✓ No violations found');
    }
  });

  // Test note: All tests PASS regardless of violations found.
  // Accessibility issues are reported for awareness and gradual improvement.
  // This non-blocking approach encourages teams to address issues without build failures.
});
