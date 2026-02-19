import { Page, Locator } from '@playwright/test';

export class EmployeePage {
  readonly page: Page;
  readonly employeeList: Locator;
  readonly addEmployeeButton: Locator;
  readonly searchInput: Locator;
  readonly employeeCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.employeeList = page.locator('text=Active Employees');
    this.addEmployeeButton = page.locator('button').filter({ hasText: /Add Employee|Create Employee/ });
    this.searchInput = page.locator('input[placeholder*="Search"]');
    this.employeeCards = page.locator('.divide-y > div').filter({ hasText: /@/ }); // Employee cards with email
  }

  async goto() {
    await this.page.goto('/admin/employees');
  }

  async isLoaded() {
    await this.page.waitForLoadState('networkidle');
    return await this.employeeList.isVisible();
  }

  async getEmployeeCount() {
    return await this.employeeCards.count();
  }

  async searchEmployee(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500); // Wait for search to complete
  }

  async clickAddEmployee() {
    await this.addEmployeeButton.click();
  }
}