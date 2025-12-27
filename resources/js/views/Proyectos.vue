<template>
  <div class="min-h-full bg-slate-100 dark:bg-slate-950">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6">
      <!-- Toolbar -->
      <div class="rounded-2xl border shadow-sm" :class="isDark ? 'border-slate-700 bg-slate-900/80 backdrop-blur' : 'border-slate-200 bg-white'">
        <div class="flex flex-wrap items-center gap-3 px-5 py-4">
          <div class="flex items-center gap-2">
            <button
              @click="showNewProjectModal = true"
              class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ t('projects.toolbar.newProject') }}
            </button>
            <button
              class="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-slate-500 transition hover:bg-slate-100"
              :class="isDark ? 'border-slate-700 bg-slate-900 hover:bg-slate-800 hover:text-white' : 'border-slate-200 bg-white'"
              aria-label="Toggle view"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h10M4 18h7" />
              </svg>
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="option in statusOptions"
              :key="option.value"
              @click="setStatusFilter(option.value)"
              class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition"
              :class="[
                statusFilter === option.value
                  ? option.activeClass
                  : option.inactiveClass
              ]"
            >
              <span class="inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-white/20 px-1 text-[11px] font-semibold"
                :class="statusFilter === option.value ? option.badgeActive : option.badgeInactive"
              >
                {{ getStatusCount(option.value) }}
              </span>
              {{ option.label }}
            </button>
          </div>

          <div class="ml-auto flex items-center gap-2">
            <div class="relative">
              <select
                v-model="itemsPerPage"
                class="appearance-none rounded-lg border px-4 py-2 text-sm font-medium"
                :class="isDark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-700'
                "
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <svg class="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <button
              class="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition"
              :class="isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4h16M4 10h16M4 16h10" />
              </svg>
              {{ t('projects.toolbar.export') }}
            </button>
            <button
              @click="showFilters = !showFilters"
              class="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition"
              :class="isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M8 6v12M16 6v12" />
              </svg>
              {{ t('projects.toolbar.filters') }}
            </button>
          </div>
        </div>

        <div class="border-t px-5 py-4" :class="isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm font-medium" :class="isDark ? 'text-slate-300' : 'text-slate-600'">
              {{ t('projects.pagination.showing') }} {{ startIndex + 1 }} {{ t('projects.pagination.of') }} {{ Math.min(endIndex, filteredProjects.length) }} {{ t('projects.pagination.projects') }} · {{ t('projects.pagination.page') }} {{ currentPage }} {{ t('projects.pagination.ofTotal') }} {{ Math.max(totalPages, 1) }}
            </p>
            <div class="relative w-full max-w-xs">
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                :placeholder="t('projects.searchPlaceholder')"
                class="w-full rounded-lg border pl-10 pr-4 py-2 text-sm"
                :class="isDark ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400'"
              >
              <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showFilters" class="rounded-2xl border px-5 py-4" :class="isDark ? 'border-slate-800 bg-slate-900/80 backdrop-blur' : 'border-slate-200 bg-white'">
        <div class="flex items-center gap-4 text-sm" :class="isDark ? 'text-slate-300' : 'text-slate-600'">
          <span class="font-medium">{{ t('projects.filtersComingSoon') }}</span>
        </div>
      </div>

      <!-- Tabla de proyectos -->
      <div class="flex-1 rounded-2xl border shadow-sm" :class="isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y" :class="isDark ? 'divide-slate-800' : 'divide-slate-200'">
            <thead :class="isDark ? 'bg-slate-900/70' : 'bg-slate-50'">
              <tr>
                <th class="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">#</th>
                <th @click="sortBy('title')" class="cursor-pointer px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <div class="flex items-center gap-2">
                    <span>{{ t('projects.table.projectName') }}</span>
                    <svg class="h-3 w-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">{{ t('projects.table.customer') }}</th>
                <th class="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">{{ t('projects.table.tags') }}</th>
                <th class="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">{{ t('projects.table.startDate') }}</th>
                <th class="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">{{ t('projects.table.deadline') }}</th>
                <th class="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">{{ t('projects.table.members') }}</th>
                <th class="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">{{ t('projects.table.status') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-slate-800' : 'divide-slate-100'">
              <tr v-if="loading">
                <td colspan="8" class="px-6 py-14 text-center text-sm" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
                  <div class="flex items-center justify-center gap-3">
                    <div class="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-blue-500"></div>
                    {{ t('projects.loading') }}
                  </div>
                </td>
              </tr>
              <tr v-else-if="paginatedProjects.length === 0">
                <td colspan="8" class="px-6 py-16 text-center" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
                  <div class="flex flex-col items-center gap-3">
                    <div class="flex h-14 w-14 items-center justify-center rounded-full border" :class="isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'">
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7h18M3 12h18M3 17h18" />
                      </svg>
                    </div>
                    <span class="text-sm font-medium">{{ t('projects.empty.title') }}</span>
                    <span class="text-xs" :class="isDark ? 'text-slate-500' : 'text-slate-400'">{{ t('projects.empty.description') }}</span>
                  </div>
                </td>
              </tr>
              <tr
                v-else
                v-for="(project, index) in paginatedProjects"
                :key="project.id"
                class="group transition"
                :class="isDark ? 'hover:bg-slate-900' : 'hover:bg-slate-50'
              "
              >
                <td class="px-6 py-5 text-sm font-semibold" :class="isDark ? 'text-slate-200' : 'text-slate-700'">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-5 text-sm">
                  <div class="flex flex-col">
                    <button
                      @click="viewProjectDetails(project)"
                      class="text-left font-semibold transition"
                      :class="isDark ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-500'"
                    >
                      {{ project.title || project.ref }}
                    </button>
                    <span class="text-[12px]" :class="isDark ? 'text-slate-400' : 'text-slate-400'">{{ t('projects.table.reference') }}: {{ project.ref || '-' }}</span>
                  </div>
                </td>
                <td class="px-6 py-5 text-sm" :class="isDark ? 'text-slate-200' : 'text-slate-600'">
                  {{ project.thirdparty_name || '—' }}
                </td>
                <td class="px-6 py-5">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in getProjectTags(project)"
                      :key="tag"
                      class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
                      :class="getTagClass(tag)"
                    >
                      {{ tag }}
                    </span>
                    <span v-if="getProjectTags(project).length === 0" class="text-xs text-slate-400">—</span>
                  </div>
                </td>
                <td class="px-6 py-5 text-sm" :class="isDark ? 'text-slate-200' : 'text-slate-600'">
                  {{ formatDate(project.date_start || project.datec) }}
                </td>
                <td class="px-6 py-5 text-sm" :class="isDark ? 'text-slate-200' : 'text-slate-600'">
                  {{ formatDate(project.date_end) }}
                </td>
                <td class="px-6 py-5">
                  <div class="flex -space-x-3">
                    <div
                      v-for="member in getProjectMembers(project)"
                      :key="member.id"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-semibold"
                      :class="isDark ? 'border-slate-800 bg-slate-800 text-slate-100' : 'border-slate-200 bg-slate-100 text-slate-600'"
                      :title="member.name"
                    >
                      {{ member.initials }}
                    </div>
                    <div
                      v-if="getProjectMembers(project).length === 0"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full border"
                      :class="isDark ? 'border-slate-800 bg-slate-900 text-slate-500' : 'border-slate-200 bg-slate-50 text-slate-400'"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.5 20a4.5 4.5 0 0 1 9 0m-4.5-7a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                      </svg>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold"
                    :class="getStatusBadgeClass(project.normalizedStatus)"
                  >
                    <span class="h-2 w-2 rounded-full" :class="getStatusDotClass(project.normalizedStatus)"></span>
                    {{ getStatusText(project.normalizedStatus) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between border-t px-6 py-4" :class="isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-slate-50'">
          <div class="flex items-center gap-1 text-xs font-medium" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
            {{ t('projects.pagination.page') }} {{ currentPage }} {{ t('projects.pagination.ofTotal') }} {{ Math.max(totalPages, 1) }}
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition"
              :class="[
                currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:-translate-y-0.5',
                isDark ? 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              ]"
            >
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
              </svg>
              {{ t('projects.pagination.previous') }}
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition"
              :class="[
                currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:-translate-y-0.5',
                isDark ? 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              ]"
            >
              {{ t('projects.pagination.next') }}
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del proyecto -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="closeModal"></div>

        <!-- Modal -->
        <div class="relative inline-block align-bottom bg-gray-900 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-gray-700" @click.stop>
          <!-- Header -->
          <div class="bg-gray-800 px-6 py-4 border-b border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold text-white">{{ t('projects.modal.title') }}</h3>
                <p class="text-gray-400 mt-1">{{ selectedProject?.ref }}</p>
              </div>
              <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="bg-gray-900 px-6 py-6">
            <div v-if="loadingDetails" class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span class="ml-3 text-gray-300">{{ t('projects.loading') }}</span>
            </div>

            <div v-else-if="projectDetails" class="space-y-6">
              <!-- Información básica -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">{{ t('projects.modal.reference') }}</label>
                    <p class="text-white bg-gray-800 px-3 py-2 rounded-lg">{{ projectDetails.ref }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">{{ t('projects.modal.status') }}</label>
                    <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full" :class="getStatusClass(getProjectStatusValue(projectDetails))">
                      {{ getStatusText(getProjectStatusValue(projectDetails)) }}
                    </span>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">{{ t('projects.modal.createdAt') }}</label>
                    <p class="text-gray-300 bg-gray-800 px-3 py-2 rounded-lg">{{ formatDate(projectDetails.date_c || projectDetails.date_creation) }}</p>
                  </div>

                  <div v-if="projectDetails.date_start">
                    <label class="block text-sm font-medium text-gray-300 mb-1">{{ t('projects.modal.startDate') }}</label>
                    <p class="text-gray-300 bg-gray-800 px-3 py-2 rounded-lg">{{ formatDate(projectDetails.date_start) }}</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">{{ t('projects.table.customer') }}</label>
                    <p class="text-gray-300 bg-gray-800 px-3 py-2 rounded-lg">{{ projectDetails.thirdparty_name || '-' }}</p>
                  </div>

                  <div v-if="projectDetails.date_end">
                    <label class="block text-sm font-medium text-gray-300 mb-1">{{ t('projects.modal.endDate') }}</label>
                    <p class="text-gray-300 bg-gray-800 px-3 py-2 rounded-lg">{{ formatDate(projectDetails.date_end) }}</p>
                  </div>

                  <div v-if="projectDetails.budget_amount">
                    <label class="block text-sm font-medium text-gray-300 mb-1">{{ t('projects.modal.budget') }}</label>
                    <p class="text-gray-300 bg-gray-800 px-3 py-2 rounded-lg">{{ formatCurrency(projectDetails.budget_amount) }}</p>
                  </div>

                  <div v-if="projectDetails.usage_bill_time">
                    <label class="block text-sm font-medium text-gray-300 mb-1">{{ t('projects.modal.usage') }}</label>
                    <p class="text-gray-300 bg-gray-800 px-3 py-2 rounded-lg">{{ projectDetails.usage_bill_time }}%</p>
                  </div>
                </div>
              </div>

              <!-- Título -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('projects.modal.titleLabel') }}</label>
                <p class="text-white bg-gray-800 px-4 py-3 rounded-lg">{{ projectDetails.title }}</p>
              </div>

              <!-- Descripción -->
              <div v-if="projectDetails.description">
                <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('projects.modal.description') }}</label>
                <div class="text-gray-300 bg-gray-800 px-4 py-3 rounded-lg max-h-64 overflow-y-auto" v-html="projectDetails.description"></div>
              </div>

              <!-- Información adicional -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                <div v-if="projectDetails.fk_user_creat_label">
                  <label class="block text-sm font-medium text-gray-400 mb-1">{{ t('projects.modal.createdBy') }}</label>
                  <p class="text-sm text-gray-300">{{ projectDetails.fk_user_creat_label }}</p>
                </div>
                <div v-if="projectDetails.public">
                  <label class="block text-sm font-medium text-gray-400 mb-1">{{ t('projects.modal.public') }}</label>
                  <p class="text-sm text-gray-300">{{ projectDetails.public === '1' ? 'Sí' : 'No' }}</p>
                </div>
                <div v-if="projectDetails.usage_opportunity">
                  <label class="block text-sm font-medium text-gray-400 mb-1">{{ t('projects.modal.opportunity') }}</label>
                  <p class="text-sm text-gray-300">{{ projectDetails.usage_opportunity }}%</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-800 px-6 py-4 border-t border-gray-700">
            <div class="flex justify-end space-x-3">
              <button @click="closeModal" class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                {{ t('projects.modal.close') }}
              </button>
              <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {{ t('projects.modal.edit') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import http from '../utils/http'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()
const { t } = useI18n()

const projects = ref([])
const loading = ref(false)
const terceros = ref([])
const tercerosMap = ref({})
const categories = ref([])
const categoriesMap = ref({})

// UI state
const showFilters = ref(false)
const showNewProjectModal = ref(false)

const statusOptions = computed(() => [
  {
    value: '',
    label: t('projects.status.all'),
    activeClass: isDark.value
      ? 'border-blue-500 bg-blue-500/20 text-blue-100'
      : 'border-blue-200 bg-blue-50 text-blue-600',
    inactiveClass: isDark.value
      ? 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300',
    badgeActive: isDark.value ? 'bg-blue-400 text-slate-950' : 'bg-white text-blue-600',
    badgeInactive: isDark.value ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'
  },
  {
    value: '1',
    label: t('projects.status.active'),
    activeClass: isDark.value
      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-100'
      : 'border-emerald-200 bg-emerald-50 text-emerald-600',
    inactiveClass: isDark.value
      ? 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300',
    badgeActive: isDark.value ? 'bg-emerald-400 text-slate-950' : 'bg-white text-emerald-600',
    badgeInactive: isDark.value ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'
  },
  {
    value: '0',
    label: t('projects.status.inactive'),
    activeClass: isDark.value
      ? 'border-slate-600 bg-slate-800 text-slate-100'
      : 'border-slate-200 bg-slate-100 text-slate-700',
    inactiveClass: isDark.value
      ? 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300',
    badgeActive: isDark.value ? 'bg-slate-500 text-slate-950' : 'bg-white text-slate-600',
    badgeInactive: isDark.value ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'
  },
  {
    value: '2',
    label: t('projects.status.closed'),
    activeClass: isDark.value
      ? 'border-blue-500 bg-blue-500/20 text-blue-100'
      : 'border-blue-200 bg-blue-50 text-blue-600',
    inactiveClass: isDark.value
      ? 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300',
    badgeActive: isDark.value ? 'bg-blue-400 text-slate-950' : 'bg-white text-blue-600',
    badgeInactive: isDark.value ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'
  }
])

// Filters and search
const searchQuery = ref('')
const statusFilter = ref('1')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Sorting
const sortField = ref('')
const sortDirection = ref('asc')

// Modal state
const showModal = ref(false)
const selectedProject = ref(null)
const projectDetails = ref(null)
const loadingDetails = ref(false)

const fetchProjects = async () => {
  loading.value = true
  try {
    const [projectsResponse, tercerosResponse] = await Promise.all([
      http.get('/api/doli/projects?limit=500&sortfield=datec&sortorder=DESC'),
      http.get('/api/doli/thirdparties?limit=1000&status=1').catch(() => ({ data: [] })),
      http.get('/api/doli/categories?type=project&limit=1000').catch(() => ({ data: [] }))
    ])

    const projectsData = projectsResponse.data || []
    terceros.value = tercerosResponse.data || []
    categories.value = Array.isArray(arguments[2]?.data) ? arguments[2].data : (arguments[2]?.data?.data || [])

    const tercerosLookup = {}
    terceros.value.forEach(tercero => {
      const idVariants = [tercero.id, String(tercero.id), Number(tercero.id)]
      idVariants.forEach(id => {
        if (id !== undefined && id !== null && id !== 'undefined' && id !== 'null') {
          tercerosLookup[id] = tercero
        }
      })
    })

    tercerosMap.value = tercerosLookup

    const categoriesLookup = {}
    categories.value.forEach(category => {
      const idVariants = [category.id, String(category.id), Number(category.id)]
      idVariants.forEach(id => {
        if (id !== undefined && id !== null && id !== 'undefined' && id !== 'null') {
          categoriesLookup[id] = category
        }
      })
    })

    categoriesMap.value = categoriesLookup

    // Enrich projects with terceros data prioritizing socid
    const enrichedProjects = projectsData.map(project => {
      const clientId = project.socid ?? project.fk_soc ?? project.fk_thirdparty ?? project.client_id ?? project.thirdparty_id
      const tercero = resolveThirdparty(clientId)
      const thirdpartyName = extractThirdpartyName(tercero)

      const normalizedStatus = normalizeProjectStatus(project.status ?? project.fk_statut ?? project.statut)

      return {
        ...project,
        thirdparty_name: thirdpartyName,
        client_id: clientId,
        normalizedStatus,
        displayedStartDate: project.date_start || project.dateo,
        displayedEndDate: project.date_end || project.datee || project.date_close,
        category_ids: extractCategoryIds(project)
      }
    })

    projects.value = enrichedProjects
  } catch (error) {
    console.error('❌ Error fetching projects:', error)
  } finally {
    loading.value = false
  }
}

// Computed properties for filtering and pagination
const filteredProjects = computed(() => {
  let filtered = [...projects.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(project => 
      project.ref?.toLowerCase().includes(query) ||
      project.title?.toLowerCase().includes(query) ||
      project.thirdparty_name?.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(project => project.normalizedStatus === statusFilter.value)
  }

  // Apply sorting
  if (sortField.value) {
    filtered.sort((a, b) => {
      let aVal = a[sortField.value]
      let bVal = b[sortField.value]

      // Handle date sorting
      if (sortField.value === 'datec' || sortField.value === 'date_end') {
        aVal = new Date(aVal * 1000)
        bVal = new Date(bVal * 1000)
      }

      // Handle numeric sorting
      if (typeof aVal === 'string' && !isNaN(aVal)) {
        aVal = parseFloat(aVal)
        bVal = parseFloat(bVal)
      }

      if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / itemsPerPage.value))

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProjects.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredProjects.value.length))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const handleSearch = () => {
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  currentPage.value = 1
}

const goToPage = (page) => {
  currentPage.value = page
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Modal methods
const viewProjectDetails = async (project) => {
  selectedProject.value = project
  showModal.value = true
  loadingDetails.value = true
  
  try {
    const response = await http.get(`/api/doli/projects/${project.id}`)
    const details = response.data
    if (!details.thirdparty_name) {
      details.thirdparty_name = extractThirdpartyName(resolveThirdparty(details.socid ?? details.fk_soc))
    }
    projectDetails.value = details
  } catch (error) {
    console.error('Error fetching project details:', error)
    projectDetails.value = {
      ...project,
      thirdparty_name: project.thirdparty_name || extractThirdpartyName(resolveThirdparty(project.socid ?? project.fk_soc))
    }
  } finally {
    loadingDetails.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  selectedProject.value = null
  projectDetails.value = null
  loadingDetails.value = false
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString * 1000).toLocaleDateString('es-ES')
}

const formatCurrency = (amount) => {
  if (!amount) return '-'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// Funciones para filtros de estado
const setStatusFilter = (status) => {
  statusFilter.value = status
  currentPage.value = 1
}

const getStatusCount = (status) => {
  if (!status) {
    return projects.value.length
  }
  return projects.value.filter(project => project.normalizedStatus === status).length
}

// Funciones para tags y miembros
const getProjectTags = (project) => {
  const categoryIds = Array.isArray(project.category_ids) ? project.category_ids : []
  return categoryIds
    .map(resolveCategory)
    .filter(Boolean)
    .map(category => category.label || category.ref || category.name)
}

const getTagClass = (tag) => {
  return isDark.value
    ? 'border border-blue-500/40 bg-blue-500/15 text-blue-200'
    : 'border border-blue-100 bg-blue-50 text-blue-600'
}

const getProjectMembers = (project) => {
  if (!Array.isArray(project.contacts_ids_internal) || project.contacts_ids_internal.length === 0) {
    return []
  }

  return project.contacts_ids_internal.map((member, index) => ({
    id: member.id || index,
    name: member.name || member.fullname || member.login || t('projects.members.unknown'),
    initials: getInitials(member.name || member.fullname || member.login || '?')
  }))
}

const resolveThirdparty = (id) => {
  if (id === undefined || id === null || id === '' || id === '0') {
    return null
  }

  const variants = [id, String(id), Number(id)]
  for (const variant of variants) {
    if (tercerosMap.value[variant]) {
      return tercerosMap.value[variant]
    }
  }

  return null
}

const extractThirdpartyName = (thirdparty) => {
  if (!thirdparty) return null
  return thirdparty.name || thirdparty.nom || thirdparty.label || thirdparty.company || thirdparty.firstname || null
}

const resolveCategory = (id) => {
  if (id === undefined || id === null || id === '' || id === '0') {
    return null
  }

  const variants = [id, String(id), Number(id)]
  for (const variant of variants) {
    if (categoriesMap.value[variant]) {
      return categoriesMap.value[variant]
    }
  }

  return null
}

const extractCategoryIds = (project) => {
  if (Array.isArray(project.categories)) {
    return project.categories
      .map(cat => cat.id || cat.fk_category || cat.category_id)
      .filter(Boolean)
  }

  if (Array.isArray(project.categorized)) {
    return project.categorized
      .map(cat => cat.id || cat.fk_category || cat.category_id)
      .filter(Boolean)
  }

  if (project.array_options?.options_categories && Array.isArray(project.array_options.options_categories)) {
    return project.array_options.options_categories.filter(Boolean)
  }

  return []
}

const normalizeProjectStatus = (value) => {
  if (value === undefined || value === null) return '0'
  const strValue = String(value)
  if (strValue === '1') return '1'
  if (strValue === '2') return '2'
  return '0'
}

const getProjectStatusValue = (project) => normalizeProjectStatus(project.normalizedStatus ?? project.status ?? project.fk_statut ?? project.statut)

const getStatusText = (status) => {
  const statusKey = {
    '0': 'inactive',
    '1': 'active',
    '2': 'closed'
  }[status] || 'inactive'

  return t(`projects.status.${statusKey}`)
}

const getStatusClass = (status) => {
  const classes = {
    '0': 'bg-slate-600 text-slate-100',
    '1': 'bg-emerald-600 text-emerald-100',
    '2': 'bg-blue-600 text-blue-100'
  }
  return classes[status] || classes['0']
}

const getInitials = (name = '') => {
  return name
    .split(' ')
    .map(part => part.trim().charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'
}

const getStatusBadgeClass = (status) => {
  const styles = {
    '0': {
      light: 'border border-slate-200 bg-slate-100 text-slate-600',
      dark: 'border border-slate-700 bg-slate-800 text-slate-100'
    },
    '1': {
      light: 'border border-emerald-200 bg-emerald-50 text-emerald-600',
      dark: 'border border-emerald-500/60 bg-emerald-500/15 text-emerald-100'
    },
    '2': {
      light: 'border border-blue-200 bg-blue-50 text-blue-600',
      dark: 'border border-blue-500/60 bg-blue-500/15 text-blue-100'
    }
  }

  const style = styles[status] || styles['0']
  return isDark.value ? style.dark : style.light
}

const getStatusDotClass = (status) => {
  const dots = {
    '0': isDark.value ? 'bg-slate-400' : 'bg-slate-400',
    '1': isDark.value ? 'bg-emerald-400' : 'bg-emerald-500',
    '2': isDark.value ? 'bg-blue-400' : 'bg-blue-500'
  }
  return dots[status] || 'bg-slate-400'
}

// Watch for filter changes to reset pagination
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

// Debug watcher to monitor projects data changes
watch(projects, (newProjects, oldProjects) => {
   console.log('🔍 Projects data changed:', {
    oldCount: oldProjects?.length || 0,
    newCount: newProjects?.length || 0,
    sampleNew: newProjects?.slice(0, 2)?.map(p => ({
      ref: p.ref,
      thirdparty_name: p.thirdparty_name
    }))
  })
}, { deep: true })

onMounted(() => {
   console.log('🚀 Component mounted, calling fetchProjects')
  fetchProjects()
})
</script>
