import { Page, Locator, expect } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly loginInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    this.page = page
    this.loginInput = page.locator('input#login, input[name="login"]').first()
    this.passwordInput = page.locator('input#password, input[name="password"]').first()
    this.submitButton = page.locator('button[type="submit"], button:has-text("Acceder"), button:has-text("Iniciar sesión")').first()
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(username: string, password: string) {
    await this.loginInput.fill(username)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async expectLoggedIn() {
    await expect(this.page).toHaveURL('/')
  }
}
