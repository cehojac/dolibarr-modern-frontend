import { test, expect } from '@playwright/test'
import { DashboardPage } from '../page-objects/DashboardPage'

test.describe('Dashboard', () => {
  test('loads without timeout console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto('/')
    await new DashboardPage(page).expectLoaded()

    const timeoutErrors = errors.filter((e) => e.toLowerCase().includes('timeout'))
    expect(timeoutErrors).toEqual([])
  })
})
