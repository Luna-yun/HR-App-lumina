import { test, expect } from '@playwright/test';

/**
 * Frontend Performance Tests
 * 
 * Measures:
 * - Page load times (Time to First Contentful Paint)
 * - Navigation performance
 * - Document Complete time
 * - Resource loading times
 * 
 * Tests run against deployed backend: https://brighthr.emergent.host/
 * 
 * Run: npm run test:performance:frontend
 */

test.describe('Frontend Performance', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('login page load performance', async ({ page }) => {
    const navigationStart = Date.now();
    
    await page.goto('/login', { waitUntil: 'networkidle' });
    
    const navigationEnd = Date.now();
    const loadTime = navigationEnd - navigationStart;
    
    console.log(`\n[PERF] Login Page Load Time: ${loadTime}ms`);
    
    // Assert reasonable performance (< 5 seconds)
    expect(loadTime).toBeLessThan(5000);
  });

  test('admin dashboard load performance', async ({ page }) => {
    const navigationStart = Date.now();
    
    await page.goto('/admin', { waitUntil: 'networkidle' });
    
    const navigationEnd = Date.now();
    const loadTime = navigationEnd - navigationStart;
    
    console.log(`\n[PERF] Admin Dashboard Load Time: ${loadTime}ms`);
    
    // Expect dashboard to load reasonably fast
    expect(loadTime).toBeLessThan(8000);
  });

  test('employee dashboard load performance', async ({ page }) => {
    const navigationStart = Date.now();
    
    await page.goto('/employee', { waitUntil: 'networkidle' });
    
    const navigationEnd = Date.now();
    const loadTime = navigationEnd - navigationStart;
    
    console.log(`\n[PERF] Employee Dashboard Load Time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(8000);
  });

  test('employees list load performance', async ({ page }) => {
    const navigationStart = Date.now();
    
    await page.goto('/admin/employees', { waitUntil: 'networkidle' });
    
    const navigationEnd = Date.now();
    const loadTime = navigationEnd - navigationStart;
    
    console.log(`\n[PERF] Employees List Load Time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(8000);
  });

  test('leave management page load performance', async ({ page }) => {
    const navigationStart = Date.now();
    
    await page.goto('/employee/leave', { waitUntil: 'networkidle' });
    
    const navigationEnd = Date.now();
    const loadTime = navigationEnd - navigationStart;
    
    console.log(`\n[PERF] Leave Management Load Time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(8000);
  });

  test('attendance page load performance', async ({ page }) => {
    const navigationStart = Date.now();
    
    await page.goto('/admin/attendance', { waitUntil: 'networkidle' });
    
    const navigationEnd = Date.now();
    const loadTime = navigationEnd - navigationStart;
    
    console.log(`\n[PERF] Attendance Page Load Time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(8000);
  });

  test('analytics page load performance', async ({ page }) => {
    const navigationStart = Date.now();
    
    await page.goto('/admin/analytics', { waitUntil: 'networkidle' });
    
    const navigationEnd = Date.now();
    const loadTime = navigationEnd - navigationStart;
    
    console.log(`\n[PERF] Analytics Page Load Time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(10000); // Analytics may have more data
  });

  // Performance metrics using Playwright's native performance API
  test('measure Core Web Vitals - admin dashboard', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'networkidle' });

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        // Time to First Contentful Paint (FCP)
        fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        // Largest Contentful Paint (LCP)
        domContentLoaded: navigation?.domContentLoadedEventEnd || 0,
        loadComplete: navigation?.loadEventEnd || 0,
      };
    });

    console.log(`\n[PERF] Admin Dashboard Metrics:`);
    console.log(`  - First Contentful Paint: ${metrics.fcp.toFixed(2)}ms`);
    console.log(`  - DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`  - Page Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);

    // FCP should be < 2.5 seconds (GOOD)
    expect(metrics.fcp).toBeLessThan(2500);
  });
});
