import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly statsCards: Locator;
  readonly recentActivity: Locator;
  readonly sidebarMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.locator('[data-testid="dashboard-welcome-banner"]');
    this.statsCards = page.locator('[data-testid="stats-card"], .grid > div').first();
    this.recentActivity = page.locator('text=Recent Activity').or(page.locator('h2').filter({ hasText: /Activity|Recent/ }));
    this.sidebarMenu = page.locator('nav, aside');
  }

  async goto() {
    await this.page.goto('/admin');
  }

  async isLoaded() {
    await this.page.waitForLoadState('networkidle');
    return await this.welcomeMessage.isVisible();
  }

  async getStatsCount() {
    return await this.statsCards.count();
  }

  async navigateToSection(section: string) {
    await this.sidebarMenu.locator(`text=${section}`).click();
  }
}