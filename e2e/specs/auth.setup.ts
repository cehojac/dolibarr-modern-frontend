import { test as setup, expect } from '@playwright/test'
import { LoginPage } from '../page-objects/LoginPage'
import { e2eEnv } from '../helpers/env'

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login(e2eEnv.userLogin, e2eEnv.userPassword)
  await loginPage.expectLoggedIn()
  await page.context().storageState({ path: 'e2e/fixtures/test-user.json' })
})
