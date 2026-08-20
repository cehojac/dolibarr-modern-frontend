import { Page, expect } from '@playwright/test'

export class DashboardPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async expectLoaded() {
    await this.page.locator('main, .dashboard, [data-testid="dashboard"]').first().waitFor({ state: 'visible', timeout: 20000 })
    await expect(this.page).toHaveURL('/')
  }
}
