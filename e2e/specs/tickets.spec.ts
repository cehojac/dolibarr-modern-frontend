import { test, expect } from '@playwright/test'
import { TicketsPage } from '../page-objects/TicketsPage'

test.describe('Tickets', () => {
  test('ticket list is reachable', async ({ page }) => {
    const tickets = new TicketsPage(page)
    await tickets.goto()
    await expect(page).toHaveURL('/tickets')
  })
})
