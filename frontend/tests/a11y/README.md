# Accessibility Testing (A11Y)

## Overview

LuminaHR implements **non-blocking accessibility audits** using [axe-core](https://github.com/dequelabs/axe-core) to scan for WCAG 2.1 violations. Tests pass regardless of violations found, enabling teams to track and improve accessibility over time without blocking deployments.

## Why Non-Blocking Tests?

Accessibility is a continuous journey, not a one-time fix. Non-blocking tests:

✓ Allow teams to establish baseline metrics  
✓ Enable gradual remediation without build failures  
✓ Integrate accessibility into CI/CD from day one  
✓ Inform priority-setting (track violations over time)  
✓ Encourage proactive fixes before reviews  

## Running Accessibility Tests

### Install Dependencies
```bash
cd frontend
npm install
```

The `@axe-core/playwright` package is already in `package.json`.

### Run Audits
```bash
# Run all accessibility tests (Chromium only)
npm run test:accessibility

# View HTML report
npm run test:accessibility:report

# Run with live browser UI
npx playwright test tests/a11y --ui
```

## Understanding Results

### Success Output
When pages have no violations:
```
[A11Y] Login Page - ✓ No violations found
[A11Y] Admin Dashboard - ✓ No violations found
```

### Violations Output
When violations are found, they're logged with rule IDs and descriptions:
```
[A11Y] Admin Employees - 3 accessibility issue(s) found
  - color-contrast: Ensures the contrast between foreground and background colors meets WCAG standards
  - button-name: Ensures buttons have accessible names
  - label: Ensures form elements have associated labels
```

## Common Violations Explained

### color-contrast
**Issue**: Text doesn't meet WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text)  
**Fix**:
- Ensure text color and background have sufficient contrast
- Use the [WebAIM contrast checker](https://webaim.org/resources/contrastchecker/)
- Test with both light and dark themes

### button-name
**Issue**: Button elements lack accessible names  
**Fix**:
```tsx
// ❌ Bad
<button><MyIcon /></button>

// ✓ Good
<button aria-label="Delete item"><MyIcon /></button>
// or
<button>Delete</button>
```

### label
**Issue**: Form inputs lack associated labels  
**Fix**:
```tsx
// ❌ Bad
<input type="email" placeholder="Email" />

// ✓ Good
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### heading-order
**Issue**: Heading hierarchy is broken (e.g., `<h1>` jumps to `<h3>`)  
**Fix**: Maintain proper heading hierarchy (h1 → h2 → h3, etc.)

### alt-text
**Issue**: Images missing alternative text  
**Fix**:
```tsx
// ❌ Bad
<img src="logo.png" />

// ✓ Good
<img src="logo.png" alt="LuminaHR Logo" />
```

## Tracked Pages

The accessibility suite scans these critical user journeys:

| Page | Route | Purpose |
|------|-------|---------|
| Login | `/login` | User authentication |
| Admin Dashboard | `/admin` | Management overview |
| Employee Dashboard | `/employee` | Employee self-service hub |
| Employees List | `/admin/employees` | HR management |
| Attendance | `/admin/attendance` | Attendance tracking |
| Leave Management | `/employee/leave` | Leave requests |
| Analytics | `/admin/analytics` | Data insights |

## Adding New Pages to Audit

1. Open [tests/a11y/accessibility.spec.ts](./tests/a11y/accessibility.spec.ts)
2. Add a new test block:
```typescript
test('my-feature accessibility', async ({ page }) => {
  await page.goto('/my-route');
  await injectAxe(page);
  
  const violations = await getViolations(page);
  if (violations.length > 0) {
    console.log(`[A11Y] My Feature - ${violations.length} accessibility issue(s) found`);
    violations.forEach((v) => {
      console.log(`  - ${v.id}: ${v.help}`);
    });
  } else {
    console.log('[A11Y] My Feature - ✓ No violations found');
  }
});
```
3. Run `npm run test:a11y` to test it

## CI/CD Integration

The accessibility tests are included in `npm run test:all`:
```bash
npm run test:all    # Runs test:e2e → test:api → test:a11y
```

**Important**: These tests NEVER fail the build. They provide visibility into accessibility status.

## Improving Accessibility

### Step 1: Identify Violations
```bash
npm run test:accessibility
# Review the console output for violations
```

### Step 2: Prioritize Fixes
- **Critical**: color-contrast, button-name, label (affects usability)
- **Medium**: heading-order, list-structure (affects navigation)
- **Nice-to-have**: alt-text for decorative images (informational)

### Step 3: Implement Fixes
Use common patterns in the codebase:
- Leverage [Shadcn/UI](https://ui.shadcn.com/) components (already a11y-aware)
- Review Radix UI docs for ARIA attributes
- Test manually with screen readers (NVDA on Windows, VoiceOver on macOS)

### Step 4: Re-run Tests
```bash
npm run test:accessibility
# Verify violations are resolved
```

### Step 5: Track Progress
Monitor violation counts over time:
- Sprint 1: 15 violations
- Sprint 2: 12 violations (improved! 🎉)
- Sprint 3: 8 violations (on track)

## Advanced: Custom Axe Rules

To ignore specific violations or use custom rules, edit the test:
```typescript
// Run axe with specific rules only (whitelist)
const violations = await getViolations(page, {
  rules: ['color-contrast', 'button-name']
});

// Or exclude certain rules (blacklist)
const violations = await getViolations(page, {
  rules: { 'color-contrast': { enabled: false } }
});
```

See [axe-core rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md) for a complete list.

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Articles](https://webaim.org/)
- [Axe DevTools](https://www.deque.com/axe/devtools/) (browser extension)
- [Shadcn/UI Accessibility](https://ui.shadcn.com/)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)

## Questions?

Refer to [TESTING_GUIDE.md](./TESTING_GUIDE.md) for general test setup or consult Playwright docs.
