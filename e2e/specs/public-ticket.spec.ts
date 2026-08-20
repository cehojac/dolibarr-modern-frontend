import { test, expect } from '@playwright/test'

test.describe('Public ticket flow', () => {
  test('public ticket page is reachable', async ({ page }) => {
    await page.goto('/new-ticket')
    await expect(page).toHaveURL('/new-ticket')
  })
})
