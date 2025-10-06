import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: () => import('../layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: '/terceros',
        name: 'Terceros',
        component: () => import('../views/Terceros.vue')
      },
      {
        path: '/terceros/clientes',
        name: 'Clientes',
        component: () => import('../views/terceros/Clientes.vue')
      },
      {
        path: '/terceros/proveedores',
        name: 'Proveedores',
        component: () => import('../views/terceros/Proveedores.vue')
      },
      {
        path: '/terceros/contactos',
        name: 'Contactos',
        component: () => import('../views/terceros/Contactos.vue')
      },
      {
        path: '/terceros/socios',
        name: 'Socios',
        component: () => import('../views/terceros/Socios.vue')
      },
      {
        path: '/terceros/clientes/:id',
        name: 'DetalleTercero',
        component: () => import('../views/terceros/DetalleTercero.vue')
      },
      {
        path: '/productos',
        name: 'Productos / Servicios',
        component: () => import('../views/Productos.vue')
      },
      {
        path: '/comercial/clientes-potenciales',
        name: 'Clientes Potenciales',
        component: () => import('../views/comercial/ClientesPotenciales.vue')
      },
      {
        path: '/comercial/presupuestos',
        name: 'Presupuestos',
        component: () => import('../views/comercial/Presupuestos.vue')
      },
      {
        path: '/comercial/contratos',
        name: 'Contratos',
        component: () => import('../views/comercial/Contratos.vue')
      },
      {
        path: '/financiera/facturas-clientes',
        name: 'Facturas a Clientes',
        component: () => import('../views/financiera/FacturasClientes.vue')
      },
      {
        path: '/financiera/facturas-proveedores',
        name: 'Facturas de Proveedor',
        component: () => import('../views/financiera/FacturasProveedores.vue')
      },
      {
        path: '/financiera/pedidos-facturables',
        name: 'Pedidos Facturables',
        component: () => import('../views/financiera/PedidosFacturables.vue')
      },
      {
        path: '/financiera/donaciones',
        name: 'Donaciones',
        component: () => import('../views/financiera/Donaciones.vue')
      },
      {
        path: '/financiera/impuestos',
        name: 'Impuestos',
        component: () => import('../views/financiera/Impuestos.vue')
      },
      {
        path: '/financiera/prestamos',
        name: 'Préstamos',
        component: () => import('../views/financiera/Prestamos.vue')
      },
      {
        path: '/financiera/pagos-varios',
        name: 'Pagos Varios',
        component: () => import('../views/financiera/PagosVarios.vue')
      },
      {
        path: '/financiera/margenes',
        name: 'Márgenes',
        component: () => import('../views/financiera/Margenes.vue')
      },
      {
        path: '/proyectos',
        name: 'Proyectos',
        component: () => import('../views/Proyectos.vue')
      },
      {
        path: '/documentos',
        name: 'Documentos',
        component: () => import('../views/Documentos.vue')
      },
      {
        path: '/agenda',
        name: 'Agenda',
        component: () => import('../views/Agenda.vue')
      },
      {
        path: '/tickets',
        name: 'Tickets',
        component: () => import('../views/Tickets.vue')
      },
      {
        path: '/tareas',
        name: 'Tareas',
        component: () => import('../views/Tareas.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Inicializar desde localStorage si no está autenticado
  if (!authStore.isAuthenticated) {
    authStore.initializeFromStorage()
  }
  
  // Si requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Verificar una vez más con el servidor antes de redirigir
    await authStore.checkAuth()
    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }
  }
  
  // Si es página de invitado y está autenticado
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    return
  }
  
  next()
})

export default router
