/**
 * Seed de datos dummy para el Dolibarr de test (Docker).
 *
 * Requiere que:
 *  - El contenedor docker/dolibarr-test esté levantado y el módulo API REST habilitado.
 *  - Exista una clave API de administrador (Inicio > Configuración > Módulos > API > Claves).
 *
 * Uso:
 *   DOLIBARR_TEST_BASE_URL=http://localhost:8080/api/index.php \
 *   DOLIBARR_TEST_API_KEY=xxxxx \
 *   node scripts/seed-dolibarr.mjs
 *
 * El script es idempotente a nivel best-effort: si algo ya existe, seguirá adelante
 * y registrará un aviso en lugar de fallar todo el proceso.
 */

import axios from 'axios'

const baseURL = process.env.DOLIBARR_TEST_BASE_URL || 'http://localhost:8080/api/index.php'
const apiKey = process.env.DOLIBARR_TEST_API_KEY

const testUserLogin = process.env.E2E_TEST_USER_LOGIN || 'e2e_test_user'
const testUserPassword = process.env.E2E_TEST_USER_PASSWORD || 'e2e_test_password'

if (!apiKey) {
  console.error('❌ Falta DOLIBARR_TEST_API_KEY. Genera una clave API de admin en Dolibarr y vuelve a ejecutar.')
  process.exit(1)
}

const http = axios.create({
  baseURL,
  headers: {
    DOLAPIKEY: apiKey,
    'Content-Type': 'application/json',
  },
})

const log = (msg) => console.log(`➡️  ${msg}`)
const ok = (msg) => console.log(`✅ ${msg}`)
const warn = (msg) => console.warn(`⚠️  ${msg}`)

async function createTestUser() {
  log(`Creando usuario de test "${testUserLogin}"...`)
  try {
    const res = await http.post('/users', {
      login: testUserLogin,
      password: testUserPassword,
      lastname: 'E2E',
      firstname: 'Test',
      admin: 0,
    })
    ok(`Usuario creado con id ${res.data}`)
    return res.data
  } catch (err) {
    warn(`No se pudo crear el usuario (¿ya existe?): ${err.response?.data?.error?.message || err.message}`)
    return null
  }
}

async function createThirdparty() {
  log('Creando tercero dummy "E2E Test Client"...')
  try {
    const res = await http.post('/thirdparties', {
      name: 'E2E Test Client',
      client: 1,
      code_client: 'auto',
      email: 'e2e-client@example.test',
    })
    ok(`Tercero creado con id ${res.data}`)
    return res.data
  } catch (err) {
    warn(`No se pudo crear el tercero: ${err.response?.data?.error?.message || err.message}`)
    return null
  }
}

async function createTicket(socid) {
  log('Creando ticket dummy...')
  try {
    const res = await http.post('/tickets', {
      subject: 'Ticket de prueba E2E',
      message: 'Descripción de prueba generada por el seed de Playwright.',
      type_code: 'OTHER',
      category_code: 'OTHER',
      severity_code: 'LOW',
      socid,
    })
    ok(`Ticket creado con id ${res.data}`)
    return res.data
  } catch (err) {
    warn(`No se pudo crear el ticket: ${err.response?.data?.error?.message || err.message}`)
    return null
  }
}

async function createProject(socid) {
  log('Creando proyecto dummy...')
  try {
    const res = await http.post('/projects', {
      ref: 'E2E-PROJ-1',
      title: 'Proyecto de prueba E2E',
      socid,
    })
    ok(`Proyecto creado con id ${res.data}`)
    return res.data
  } catch (err) {
    warn(`No se pudo crear el proyecto: ${err.response?.data?.error?.message || err.message}`)
    return null
  }
}

async function createTask(projectId) {
  if (!projectId) return null
  log('Creando tarea dummy...')
  try {
    const res = await http.post('/tasks', {
      ref: 'E2E-TASK-1',
      fk_project: projectId,
      label: 'Tarea de prueba E2E',
      description: 'Tarea generada por el seed de Playwright.',
    })
    ok(`Tarea creada con id ${res.data}`)
    return res.data
  } catch (err) {
    warn(`No se pudo crear la tarea: ${err.response?.data?.error?.message || err.message}`)
    return null
  }
}

async function createIntervention(socid, projectId, ticketId) {
  log('Creando intervención dummy...')
  try {
    const res = await http.post('/interventions', {
      socid,
      fk_project: projectId,
      description: 'Intervención de prueba E2E',
      duration: 3600,
    })
    const interventionId = res.data
    ok(`Intervención creada con id ${interventionId}`)

    if (ticketId) {
      try {
        await http.put(`/interventions/${interventionId}`, {
          linkedObjectsIds: { ticket: [ticketId] },
        })
        ok('Intervención vinculada al ticket')
      } catch (linkErr) {
        warn(`No se pudo vincular la intervención al ticket: ${linkErr.response?.data?.error?.message || linkErr.message}`)
      }
    }
    return interventionId
  } catch (err) {
    warn(`No se pudo crear la intervención: ${err.response?.data?.error?.message || err.message}`)
    return null
  }
}

async function main() {
  console.log(`\n🌱 Seed Dolibarr test → ${baseURL}\n`)

  await createTestUser()
  const socid = await createThirdparty()
  const ticketId = socid ? await createTicket(socid) : null
  const projectId = socid ? await createProject(socid) : null
  if (projectId) await createTask(projectId)
  if (socid) await createIntervention(socid, projectId, ticketId)

  console.log('\n🌱 Seed completado.\n')
}

main().catch((err) => {
  console.error('❌ Error inesperado en el seed:', err.message)
  process.exit(1)
})
