/**
 * Utilidades para trabajar con terceros (thirdparties) de Dolibarr
 */

/**
 * Detecta el tipo de tercero basándose en los campos client y fournisseur
 * 
 * Lógica de Dolibarr:
 * - client = 0 → No es cliente
 * - client = 1 → Cliente normal
 * - client = 2 → Prospecto (cliente potencial)
 * - client = 3 → Cliente convertido o mixto (cliente + prospecto)
 * - fournisseur = 0 → No es proveedor
 * - fournisseur = 1 → Es proveedor
 * 
 * @param {Object} thirdparty - Objeto tercero con campos client y fournisseur
 * @returns {Object} Objeto con información del tipo de tercero
 */
export function getThirdpartyType(thirdparty) {
  if (!thirdparty) {
    return {
      type: 'unknown',
      label: 'Desconocido',
      types: [],
      isClient: false,
      isProspect: false,
      isSupplier: false,
      isPartner: false
    }
  }

  const client = parseInt(thirdparty.client) || 0
  const fournisseur = parseInt(thirdparty.fournisseur) || 0

  // Determinar tipos
  const isClient = client === 1 || client === 3
  const isProspect = client === 2 || client === 3
  const isSupplier = fournisseur === 1
  const isPartner = isClient && isSupplier // Socio = Cliente + Proveedor

  // Construir array de tipos
  const types = []
  if (isClient) types.push('cliente')
  if (isProspect) types.push('prospecto')
  if (isSupplier) types.push('proveedor')

  // Determinar tipo principal y etiqueta
  let type = 'generic'
  let label = 'Tercero'

  if (isPartner) {
    type = 'partner'
    label = 'Socio'
  } else if (isClient && isProspect) {
    type = 'client-prospect'
    label = 'Cliente + Prospecto'
  } else if (isClient) {
    type = 'client'
    label = 'Cliente'
  } else if (isProspect) {
    type = 'prospect'
    label = 'Prospecto'
  } else if (isSupplier) {
    type = 'supplier'
    label = 'Proveedor'
  }

  return {
    type,
    label,
    types,
    isClient,
    isProspect,
    isSupplier,
    isPartner,
    rawValues: {
      client,
      fournisseur
    }
  }
}

/**
 * Obtiene la clase CSS para el badge según el tipo de tercero
 * @param {Object} thirdparty - Objeto tercero
 * @returns {string} Clases CSS para el badge
 */
export function getThirdpartyBadgeClass(thirdparty) {
  const typeInfo = getThirdpartyType(thirdparty)

  const classes = {
    'partner': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'client': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'prospect': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'supplier': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'client-prospect': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'generic': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  return classes[typeInfo.type] || classes.generic
}

/**
 * Obtiene el icono SVG path según el tipo de tercero
 * @param {Object} thirdparty - Objeto tercero
 * @returns {string} Path del SVG icon
 */
export function getThirdpartyIconPath(thirdparty) {
  const typeInfo = getThirdpartyType(thirdparty)

  const icons = {
    'partner': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', // Socios
    'client': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', // Cliente
    'prospect': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', // Prospecto (calendario)
    'supplier': 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', // Proveedor (caja)
    'client-prospect': 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', // Cliente + Prospecto (badge check)
    'generic': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' // Genérico (edificio)
  }

  return icons[typeInfo.type] || icons.generic
}

/**
 * Obtiene múltiples badges si el tercero tiene varios tipos
 * @param {Object} thirdparty - Objeto tercero
 * @returns {Array} Array de objetos con label y class para cada badge
 */
export function getThirdpartyBadges(thirdparty) {
  const typeInfo = getThirdpartyType(thirdparty)
  const badges = []

  if (typeInfo.isClient) {
    badges.push({
      label: 'Cliente',
      class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    })
  }

  if (typeInfo.isProspect) {
    badges.push({
      label: 'Prospecto',
      class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    })
  }

  if (typeInfo.isSupplier) {
    badges.push({
      label: 'Proveedor',
      class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    })
  }

  if (badges.length === 0) {
    badges.push({
      label: 'Tercero',
      class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    })
  }

  return badges
}

/**
 * Filtra terceros por tipo
 * @param {Array} thirdparties - Array de terceros
 * @param {string} filterType - Tipo a filtrar: 'client', 'prospect', 'supplier', 'partner', 'all'
 * @returns {Array} Array filtrado de terceros
 */
export function filterThirdpartiesByType(thirdparties, filterType = 'all') {
  if (!Array.isArray(thirdparties) || filterType === 'all') {
    return thirdparties
  }

  return thirdparties.filter(tp => {
    const typeInfo = getThirdpartyType(tp)

    switch (filterType) {
      case 'client':
        return typeInfo.isClient && !typeInfo.isSupplier
      case 'prospect':
        return typeInfo.isProspect && !typeInfo.isClient
      case 'supplier':
        return typeInfo.isSupplier && !typeInfo.isClient
      case 'partner':
        return typeInfo.isPartner
      default:
        return true
    }
  })
}

/**
 * Obtiene estadísticas de tipos de terceros
 * @param {Array} thirdparties - Array de terceros
 * @returns {Object} Objeto con contadores por tipo
 */
export function getThirdpartiesStats(thirdparties) {
  if (!Array.isArray(thirdparties)) {
    return {
      total: 0,
      clients: 0,
      prospects: 0,
      suppliers: 0,
      partners: 0,
      generic: 0
    }
  }

  const stats = {
    total: thirdparties.length,
    clients: 0,
    prospects: 0,
    suppliers: 0,
    partners: 0,
    generic: 0
  }

  thirdparties.forEach(tp => {
    const typeInfo = getThirdpartyType(tp)

    if (typeInfo.isPartner) {
      stats.partners++
    } else if (typeInfo.isClient) {
      stats.clients++
    } else if (typeInfo.isProspect) {
      stats.prospects++
    } else if (typeInfo.isSupplier) {
      stats.suppliers++
    } else {
      stats.generic++
    }
  })

  return stats
}
