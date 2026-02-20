import { test, expect } from '@playwright/test';

interface AxeResults {
  violations: Array<{ id: string; description: string }>;
}

test.describe('Accessibility checks', () => {
  test('login page has no axe violations', async ({ page }) => {
    await page.goto('/login');
    // Inject axe from CDN to avoid requiring local axe-core devDependency
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.13.0/axe.min.js' });
    const results = await page.evaluate(async () => {
      const axeResults = (window as { axe?: { run: () => Promise<AxeResults> } }).axe;
      if (!axeResults) throw new Error('axe not loaded');
      return axeResults.run();
    });
    const violations = results?.violations || [];
    if (violations.length > 0) {
      console.error('Accessibility violations on /login:', JSON.stringify(violations, null, 2));
    }
    expect(violations.length).toBe(0);
  });

  test.use({ storageState: 'playwright/.auth/user.json' });
  test('dashboard has no axe violations', async ({ page }) => {
    await page.goto('/admin');
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.13.0/axe.min.js' });
    const results = await page.evaluate(async () => {
      const axeResults = (window as { axe?: { run: () => Promise<AxeResults> } }).axe;
      if (!axeResults) throw new Error('axe not loaded');
      return axeResults.run();
    });
    const violations = results?.violations || [];
    if (violations.length > 0) {
      console.error('Accessibility violations on /admin:', JSON.stringify(violations, null, 2));
    }
    expect(violations.length).toBe(0);
  });
});
