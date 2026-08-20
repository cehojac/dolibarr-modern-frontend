import { test, expect } from '@playwright/test'
import { LoginPage } from '../page-objects/LoginPage'

test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Authentication', () => {
  test('login with valid credentials redirects to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    const user = process.env.E2E_USER_LOGIN || ''
    const pass = process.env.E2E_USER_PASSWORD || ''
    await loginPage.login(user, pass)
    await loginPage.expectLoggedIn()
  })

  test('protected routes redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/tickets')
    await expect(page).toHaveURL(/.*login/)
  })
})
