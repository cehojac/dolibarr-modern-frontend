import { useApiCache } from './useApiCache'
import { usePermissionsStore } from './usePermissions'

const DEFAULT_TTL = 600000 // 10 minutos

const RESOURCE_CONFIGS = [
  {
    key: 'thirdparties',
    permissions: ['societe->lire'],
    buildRequest: () => ({
      url: '/api/doli/thirdparties',
      options: {
        params: { limit: 1000, status: 1 },
        ttl: DEFAULT_TTL,
        cacheKey: 'thirdparties:active'
      }
    })
  },
  {
    key: 'categories',
    permissions: ['categorie->lire', 'projet->lire'],
    buildRequest: () => ({
      url: '/api/doli/categories',
      options: {
        params: { type: 'project', limit: 1000 },
        ttl: DEFAULT_TTL,
        cacheKey: 'categories:project'
      }
    })
  },
  {
    key: 'projects',
    permissions: ['projet->lire'],
    buildRequest: () => ({
      url: '/api/doli/projects',
      options: {
        params: { limit: 500, sortfield: 'datec', sortorder: 'DESC' },
        ttl: DEFAULT_TTL,
        cacheKey: 'projects:list'
      }
    })
  },
  {
    key: 'tickets',
    permissions: ['ticket->lire', 'ticket->read', 'tickets->lire', 'tickets->read'],
    requiresUser: true,
    buildRequest: (userIdentifiers) => buildTicketRequest(userIdentifiers)
  },
  {
    key: 'tasks',
    permissions: ['projet->lire', 'task->lire', 'task->read'],
    requiresUser: true,
    buildRequest: (userIdentifiers) => buildTaskRequest(userIdentifiers)
  }
]

const sanitizeSqlValue = (value) => String(value ?? '').replace(/'/g, "''")

const extractUserIdentifiers = (user = {}) => {
  if (!user) return { id: null, login: null }
  const id = user.id || user.rowid || user.user_id || user.userid || null
  const login = user.login || user.user || null
  return { id, login }
}

const buildTicketRequest = ({ id, login }) => {
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
    limit: 500,
    sortfield: 'datec',
    sortorder: 'DESC'
  }

  if (clauses.length) {
    params.sqlfilters = clauses.join('and')
  }

  const cacheSuffix = id || login || 'self'

  return {
    url: '/api/doli/tickets',
    options: {
      params,
      ttl: DEFAULT_TTL,
      timeout: 5000,
      cacheKey: `tickets:assigned:${cacheSuffix}`
    }
  }
}

const buildTaskRequest = ({ id, login }) => {
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
    limit: 1000,
    sortfield: 'dateo',
    sortorder: 'DESC'
  }

  if (clauses.length) {
    params.sqlfilters = clauses.join('and')
  }

  const cacheSuffix = id || login || 'self'

  return {
    url: '/api/doli/tasks',
    options: {
      params,
      ttl: DEFAULT_TTL,
      cacheKey: `tasks:assigned:${cacheSuffix}`
    }
  }
}

export function useDataPreloader() {
  const permissionsStore = usePermissionsStore()
  const { cachedFetch } = useApiCache()

  const ensurePermissions = async ({ forceRefresh = false } = {}) => {
    try {
      const alreadyLoaded = permissionsStore.permissions.length > 0 && !permissionsStore.shouldRefresh()

      if (alreadyLoaded && !forceRefresh) {
        return { key: 'permissions', status: 'cached' }
      }

      await permissionsStore.fetchPermissions()
      return { key: 'permissions', status: 'loaded' }
    } catch (error) {
      console.error('❌ Error precargando permisos:', error)
      return { key: 'permissions', status: 'error', error }
    }
  }

  const hasRequiredPermissions = (requiredPermissions = []) => {
    if (!requiredPermissions?.length) {
      return true
    }

    if (typeof permissionsStore.hasAnyPermission === 'function') {
      return permissionsStore.hasAnyPermission(requiredPermissions)
    }

    return requiredPermissions.some(permission => permissionsStore.permissions.includes(permission))
  }

  const preloadResource = async (resourceConfig, { userIdentifiers, forceRefresh = false } = {}) => {
    const { key, permissions = [], requiresUser = false, buildRequest } = resourceConfig

    if (!hasRequiredPermissions(permissions)) {
      return { key, status: 'skipped', reason: 'missing_permission' }
    }

    if (requiresUser && (!userIdentifiers?.id && !userIdentifiers?.login)) {
      return { key, status: 'skipped', reason: 'missing_user' }
    }

    const request = buildRequest(userIdentifiers)

    if (!request) {
      return { key, status: 'skipped', reason: 'no_request' }
    }

    const { url, options } = request

    try {
      const start = typeof performance !== 'undefined' ? performance.now() : Date.now()
      const result = await cachedFetch(url, { ...options, forceRefresh })
      const end = typeof performance !== 'undefined' ? performance.now() : Date.now()

      return {
        key,
        status: 'loaded',
        fromCache: !!result?.fromCache,
        duration: Math.round(end - start)
      }
    } catch (error) {
      console.error(`❌ Error precargando ${key}:`, error)
      return { key, status: 'error', error }
    }
  }

  const preloadAdditionalData = async ({ user, includePermissions = true, forceRefresh = false } = {}) => {
    const summary = []

    if (includePermissions) {
      const permissionsResult = await ensurePermissions({ forceRefresh })
      summary.push(permissionsResult)
    }

    const userIdentifiers = extractUserIdentifiers(user)

    const resourceResults = await Promise.all(
      RESOURCE_CONFIGS.map(resource => preloadResource(resource, { userIdentifiers, forceRefresh }))
    )

    summary.push(...resourceResults)

    return summary
  }

  return {
    ensurePermissions,
    preloadAdditionalData
  }
}
