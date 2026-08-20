import { config } from 'dotenv'

config({ path: '.env.testing' })

export const e2eEnv = {
  baseURL: process.env.E2E_BASE_URL || 'http://localhost:8000',
  userLogin: process.env.E2E_USER_LOGIN || '',
  userPassword: process.env.E2E_USER_PASSWORD || '',
}
