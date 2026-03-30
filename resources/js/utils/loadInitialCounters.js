import http from '../utils/http'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const runStep = async (label, fn) => {
  try {
    await fn()
  } catch (error) {
    console.warn(`⚠️ Precarga ${label} fallida:`, error?.message ?? error)
  }
}

export async function loadInitialCounters(user) {
  if (!user) {
    console.warn('⚠️ loadInitialCounters llamado sin usuario, se omite precarga')
    return
  }

  const userId = user.id || user.rowid || user.user_id || null

  const steps = [
    () => runStep('tickets', async () => {
      const params = {
        limit: 500,
        sortfield: 'datec',
        sortorder: 'DESC',
        sqlfilters: '(t.fk_statut:<>:8)'
      }

      await http.get('/api/doli/tickets', {
        params,
        timeout: 15000
      })
    }),
    () => runStep('tareas', async () => {
      const params = {
        limit: 200,
        sortfield: 't.rowid',
        sortorder: 'DESC',
        sqlfilters: '(t.progress:<:100)'
      }

      await http.get('/api/doli/tasks', {
        params,
        timeout: 15000
      })
    }),
    () => runStep('agenda', async () => {
      if (!userId) return

      await http.get('/api/doli/agendaevents', {
        params: {
          limit: 200,
          sortfield: 't.datep',
          sortorder: 'DESC',
          user_ids: userId
        },
        timeout: 15000
      })
    })
  ]

  for (let i = 0; i < steps.length; i += 1) {
    await steps[i]()
    if (i < steps.length - 1) {
      await delay(200)
    }
  }
}
