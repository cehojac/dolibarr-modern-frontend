/*
 * Smoke test for login preload endpoints.
 *
 * Usage:
 *   TEST_LOGIN=<user> TEST_PASSWORD=<pass> [TEST_BASE_URL=http://localhost] node scripts/testPreloadEndpoints.js
 *
 * Optional CLI flags override env vars:
 *   node scripts/testPreloadEndpoints.js --base-url=http://localhost:8000 --login=admin --password=secret
 */

const axios = require('axios')

const parseArgs = () => {
  const args = process.argv.slice(2)
  return args.reduce((acc, arg) => {
    const [key, value] = arg.split('=')
    const normalizedKey = key.replace(/^--/, '')
    acc[normalizedKey] = value ?? true
    return acc
  }, {})
}

const args = parseArgs()

const BASE_URL = args['base-url'] || process.env.TEST_BASE_URL || 'http://localhost'
const LOGIN = args.login || process.env.TEST_LOGIN
const PASSWORD = args.password || process.env.TEST_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('❌ Missing credentials. Set TEST_LOGIN/TEST_PASSWORD env vars or pass --login/--password flags.')
  process.exit(1)
}

const normalizeCollection = (collection) => {
  if (Array.isArray(collection)) {
    return collection
  }
  if (collection && Array.isArray(collection.data)) {
    return collection.data
  }
  return []
}

const sanitizeSqlValue = (value) => String(value ?? '').replace(/'/g, "''")

const extractUserIdentifiers = (user = {}) => {
  if (!user) return { id: null, login: null }
  const id = user.id || user.rowid || user.user_id || user.userid || null
  const login = user.login || user.user || null
  return { id, login }
}

const hasAnyPermission = (permissions = [], required = []) => {
  if (!required.length) return true
  return required.some(permission => permissions.includes(permission))
}

const RESOURCE_CONFIGS = [
  {
    key: 'thirdparties',
    label: 'Terceros',
    permissions: ['societe->lire'],
    buildRequest: () => ({
      method: 'get',
      url: '/api/doli/thirdparties',
      options: {
        params: { limit: 50, status: 1 },
        timeout: 10000
      }
    })
  },
  {
    key: 'categories',
    label: 'Categorías',
    permissions: ['categorie->lire', 'projet->lire'],
    buildRequest: () => ({
      method: 'get',
      url: '/api/doli/categories',
      options: {
        params: { type: 'project', limit: 200 },
        timeout: 10000
      }
    })
  },
  {
    key: 'projects',
    label: 'Proyectos',
    permissions: ['projet->lire'],
    buildRequest: () => ({
      method: 'get',
      url: '/api/doli/projects',
      options: {
        params: { limit: 200, sortfield: 'datec', sortorder: 'DESC' },
        timeout: 15000
      }
    })
  },
  {
    key: 'tickets',
    label: 'Tickets asignados',
    permissions: ['ticket->lire', 'ticket->read', 'tickets->lire', 'tickets->read'],
    requiresUser: true,
    buildRequest: ({ id, login }) => {
      if (!id && !login) {
        return null
      }

      const clauses = []

      if (id) {
        clauses.push(`(t.fk_user_assign:=:${id})`)
      }

      if (login) {
        clauses.push(`(t.fk_user_assign_login:=:'${sanitizeSqlValue(login)}')`)
      }

      clauses.push('(t.fk_statut:<>:8)')

      const params = {
        limit: 200,
        sortfield: 'datec',
        sortorder: 'DESC'
      }

      if (clauses.length) {
        params.sqlfilters = clauses.join('and')
      }

      return {
        method: 'get',
        url: '/api/doli/tickets',
        options: {
          params,
          timeout: 15000
        }
      }
    }
  },
  {
    key: 'tasks',
    label: 'Tareas asignadas',
    permissions: ['projet->lire', 'task->lire', 'task->read'],
    requiresUser: true,
    buildRequest: ({ id, login }) => {
      if (!id && !login) {
        return null
      }

      const clauses = ['(t.progress:<:100)or(t.progress:is:null)']

      if (id) {
        clauses.push(`(t.fk_user_assign:=:${id})`)
      } else if (login) {
        clauses.push(`(t.fk_user_assign_login:=:'${sanitizeSqlValue(login)}')`)
      }

      const params = {
        limit: 500,
        sortfield: 'dateo',
        sortorder: 'DESC'
      }

      if (clauses.length) {
        params.sqlfilters = clauses.join('and')
      }

      return {
        method: 'get',
        url: '/api/doli/tasks',
        options: {
          params,
          timeout: 15000
        }
      }
    }
  }
]

const run = async () => {
  console.log('▶️  Running preload endpoint smoke test against', BASE_URL)

  const loginResponse = await axios.post(
    `${BASE_URL}/api/auth/login`,
    { login: LOGIN, password: PASSWORD },
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      validateStatus: () => true,
      timeout: 15000
    }
  )

  if (loginResponse.status !== 200) {
    throw new Error(`Login failed (status ${loginResponse.status}): ${loginResponse.data?.message || 'Unknown error'}`)
  }

  const cookies = loginResponse.headers['set-cookie']
  if (!cookies || !cookies.length) {
    throw new Error('No session cookies returned by login response.')
  }

  const sessionCookie = cookies.map(cookie => cookie.split(';')[0]).join('; ')
  const user = loginResponse.data?.user || {}

  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
      Cookie: sessionCookie
    },
    validateStatus: () => true
  })

  const results = []

  console.log('➡️  Fetching permissions...')
  const permissionsResponse = await client.get('/api/auth/permissions')
  if (permissionsResponse.status !== 200) {
    throw new Error(`Failed to fetch permissions (status ${permissionsResponse.status})`)
  }

  const permissions = permissionsResponse.data?.permissions || []
  results.push({
    key: 'permissions',
    label: 'Permisos',
    status: 'success',
    count: permissions.length
  })
  console.log(`✅ Permissions loaded (${permissions.length})`)

  const userIdentifiers = extractUserIdentifiers(user)

  for (const resource of RESOURCE_CONFIGS) {
    const { key, label, permissions: requiredPermissions = [], requiresUser = false } = resource

    if (!hasAnyPermission(permissions, requiredPermissions)) {
      results.push({ key, label, status: 'skipped', reason: 'missing_permission' })
      console.warn(`⚠️  Skipped ${label}: missing required permissions (${requiredPermissions.join(', ')})`)
      continue
    }

    if (requiresUser && (!userIdentifiers.id && !userIdentifiers.login)) {
      results.push({ key, label, status: 'skipped', reason: 'missing_user' })
      console.warn(`⚠️  Skipped ${label}: user identifiers not available.`)
      continue
    }

    const request = resource.buildRequest(userIdentifiers)
    if (!request) {
      results.push({ key, label, status: 'skipped', reason: 'no_request' })
      console.warn(`⚠️  Skipped ${label}: request could not be constructed.`)
      continue
    }

    const { method, url, options = {} } = request

    console.log(`➡️  Fetching ${label} (${url})...`)
    const response = await client.request({ method, url, ...options })

    if (response.status >= 200 && response.status < 300) {
      const data = normalizeCollection(response.data)
      results.push({ key, label, status: 'success', count: data.length, fromCache: !!response.data?.fromCache })
      console.log(`✅ ${label} OK (${data.length} registros)`)
    } else {
      results.push({ key, label, status: 'error', statusCode: response.status, message: response.data?.message })
      console.error(`❌ ${label} failed (status ${response.status})`)
    }
  }

  return results
}

run()
  .then(results => {
    console.log('\n📊 Resultado del smoke test:')
    for (const result of results) {
      const { label, status } = result
      if (status === 'success') {
        console.log(`  ✅ ${label}: ${result.count} registros${result.fromCache ? ' (from cache)' : ''}`)
      } else if (status === 'skipped') {
        console.log(`  ⚠️ ${label}: omitido (${result.reason})`)
      } else {
        console.log(`  ❌ ${label}: error (status ${result.statusCode || 'n/a'}) ${result.message ? '- ' + result.message : ''}`)
      }
    }

    const hasErrors = results.some(result => result.status === 'error')
    if (hasErrors) {
      process.exitCode = 1
    } else {
      console.log('\n✅ Smoke test completado sin errores fatales.')
    }
  })
  .catch(error => {
    console.error('\n❌ Smoke test failed:', error.message)
    process.exitCode = 1
  })
