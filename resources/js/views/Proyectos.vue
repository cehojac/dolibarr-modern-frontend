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
        <div class="relative inline-block align-bottom bg-gray-900 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full border border-gray-700/80" @click.stop>
          <!-- Header -->
          <div class="bg-gray-800/70 px-6 py-6 border-b border-gray-700/70">
            <div class="flex flex-col gap-6">
              <div class="flex flex-wrap items-start justify-between gap-6">
                <div class="space-y-3">
                  <div class="flex flex-wrap items-center gap-3">
                    <h3 class="text-2xl font-semibold text-white tracking-tight">{{ projectTitle || t('projects.modal.untitledProject') }}</h3>
                    <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold" :class="projectStatusBadgeClass">
                      <span class="h-2 w-2 rounded-full" :class="projectStatusDotClass"></span>
                      {{ projectStatusText }}
                    </span>
                  </div>
                  <div class="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <span>{{ t('projects.modal.labels.projectCode') }} {{ projectReferenceCode }}</span>
                    <span class="hidden h-1 w-1 rounded-full bg-gray-600 md:inline"></span>
                    <span>{{ t('projects.modal.labels.customer') }} {{ projectCustomerName }}</span>
                  </div>
                  <div v-if="projectModalTags.length" class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in projectModalTags"
                      :key="`modal-tag-${tag}`"
                      class="inline-flex items-center rounded-full border border-blue-400/40 bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-100"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  <p v-else class="text-xs text-gray-500">{{ t('projects.modal.labels.noTags') }}</p>
                </div>

                <div class="flex flex-col items-end gap-4 text-right">
                  <div v-if="projectTeamMembers.length" class="flex -space-x-3">
                    <div
                      v-for="member in projectTeamMembers.slice(0, 4)"
                      :key="member.id"
                      class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-800 bg-blue-600 text-sm font-semibold text-white shadow-md"
                    >
                      {{ member.initials }}
                    </div>
                    <div
                      v-if="projectTeamMembers.length > 4"
                      class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-800 bg-gray-700 text-xs font-semibold text-gray-200"
                    >
                      +{{ projectTeamMembers.length - 4 }}
                    </div>
                  </div>
                  <p v-else class="text-xs text-gray-500">{{ t('projects.modal.labels.noTeam') }}</p>

                  <div class="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-100 transition hover:bg-blue-500/20"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
                      </svg>
                      {{ t('projects.modal.actions.newTask') }}
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h8m-8 4h8m-5 4h5" />
                      </svg>
                      {{ t('projects.modal.actions.invoiceProject') }}
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-3 py-2 text-xs font-semibold text-gray-300 transition hover:bg-gray-700/80 hover:text-white"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6l4 2" />
                      </svg>
                      {{ t('projects.modal.actions.more') }}
                    </button>
                  </div>
                  <a href="#" class="text-xs font-medium text-blue-300 hover:text-blue-200">{{ t('projects.modal.documentation') }}</a>
                </div>
              </div>

              <button @click="closeModal" class="absolute right-6 top-6 text-gray-400 transition hover:text-white">
                <span class="sr-only">{{ t('projects.modal.close') }}</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Tabs -->
          <div class="bg-gray-900 px-6">
            <nav class="flex flex-nowrap gap-2 overflow-x-auto border-b border-gray-800/80 pb-1" aria-label="Project sections">
              <button
                v-for="tab in modalTabs"
                :key="tab.id"
                type="button"
                @click="activeModalTab = tab.id"
                class="inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide transition"
                :class="activeModalTab === tab.id
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-200'"
              >
                {{ tab.label }}
                <span
                  v-if="tab.badge !== undefined && tab.badge !== null"
                  class="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-gray-700 px-1 text-[10px] font-semibold text-gray-200"
                >
                  {{ tab.badge }}
                </span>
              </button>
            </nav>
          </div>

          <!-- Content -->
          <div class="bg-gray-900 px-6 py-6">
            <div v-if="loadingDetails" class="flex items-center justify-center py-10">
              <div class="h-9 w-9 animate-spin rounded-full border-2 border-blue-500/40 border-t-transparent"></div>
              <span class="ml-3 text-sm text-gray-300">{{ t('projects.loading') }}</span>
            </div>

            <div v-else-if="projectDetails || selectedProject" class="space-y-8">
              <div v-if="activeModalTab === 'overview'" class="space-y-8">
                <!-- Progress & Metrics -->
                <div class="grid gap-4 md:grid-cols-3">
                  <div class="col-span-3 rounded-2xl border border-gray-800/80 bg-gray-800/30 p-6 shadow-lg">
                    <div class="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">{{ t('projects.modal.metrics.progress') }}</p>
                        <p class="mt-2 text-4xl font-bold text-white">{{ projectProgress }}%</p>
                      </div>
                      <div class="text-right">
                        <p class="text-xs text-gray-400">{{ t('projects.modal.labels.status') }}</p>
                        <p class="text-sm font-semibold text-gray-200">{{ projectStatusText }}</p>
                      </div>
                    </div>
                    <div class="mt-5 h-2 w-full overflow-hidden rounded-full bg-gray-900">
                      <div class="h-full rounded-full bg-emerald-500 transition-all" :style="{ width: projectProgress + '%' }"></div>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-gray-800/80 bg-gray-800/20 p-5 shadow">
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">{{ t('projects.modal.metrics.tasks') }}</p>
                    <div class="mt-3 flex items-baseline gap-2">
                      <span class="text-3xl font-semibold text-white">{{ projectTasksSummary.open !== null ? projectTasksSummary.open : '—' }}</span>
                      <span class="text-xs text-gray-500">/ {{ projectTasksSummary.total !== null ? projectTasksSummary.total : '—' }}</span>
                    </div>
                    <div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-900">
                      <div class="h-full rounded-full bg-blue-500 transition-all" :style="{ width: projectTasksSummary.completion + '%' }"></div>
                    </div>
                    <p class="mt-2 text-xs text-gray-500">{{ t('projects.modal.metrics.completion') }} {{ projectTasksSummary.completion }}%</p>
                  </div>

                  <div class="rounded-2xl border border-gray-800/80 bg-gray-800/20 p-5 shadow">
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">{{ t('projects.modal.metrics.daysLeft') }}</p>
                    <p class="mt-3 text-3xl font-semibold text-white">
                      {{ projectDeadlineSummary.daysLeft !== null ? projectDeadlineSummary.daysLeft : '—' }}
                    </p>
                    <div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-900">
                      <div
                        class="h-full rounded-full bg-emerald-500 transition-all"
                        :style="{ width: (projectDeadlineSummary.percent ?? 0) + '%' }"
                      ></div>
                    </div>
                    <p class="mt-2 text-xs text-gray-500">
                      {{ projectDeadlineSummary.percent !== null ? projectDeadlineSummary.percent + '%' : t('projects.modal.labels.notAvailable') }}
                    </p>
                  </div>

                  <div class="rounded-2xl border border-gray-800/80 bg-gray-800/20 p-5 shadow">
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">{{ t('projects.modal.metrics.loggedHours') }}</p>
                    <p class="mt-3 text-3xl font-semibold text-white">{{ projectLoggedHours }}</p>
                    <p class="mt-2 text-xs text-gray-500">{{ t('projects.modal.metrics.loggedHoursSubtitle') }}</p>
                  </div>

                  <div class="rounded-2xl border border-gray-800/80 bg-gray-800/20 p-5 shadow">
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">{{ t('projects.modal.metrics.budget') }}</p>
                    <p class="mt-3 text-3xl font-semibold text-white">{{ projectBudgetAmount }}</p>
                    <p class="mt-2 text-xs text-gray-500">{{ t('projects.modal.metrics.budgetSubtitle') }}</p>
                  </div>

                  <div class="rounded-2xl border border-gray-800/80 bg-gray-800/20 p-5 shadow">
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">{{ t('projects.modal.metrics.expenses') }}</p>
                    <p class="mt-3 text-3xl font-semibold text-white">—</p>
                    <p class="mt-2 text-xs text-gray-500">{{ t('projects.modal.metrics.expensesSubtitle') }}</p>
                  </div>
                </div>

                <!-- Overview Cards -->
                <div class="grid gap-6 lg:grid-cols-2">
                  <div class="rounded-2xl border border-gray-800/80 bg-gray-800/30 p-6">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                      <h4 class="text-sm font-semibold uppercase tracking-wide text-gray-300">{{ t('projects.modal.overview.title') }}</h4>
                      <button type="button" class="inline-flex items-center gap-2 rounded-full border border-gray-600 px-3 py-1 text-xs font-semibold text-gray-300 transition hover:bg-gray-700/80">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h16" />
                        </svg>
                        {{ t('projects.modal.overview.export') }}
                      </button>
                    </div>
                    <dl class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                      <div>
                        <dt class="text-gray-400">{{ t('projects.modal.overview.projectId') }}</dt>
                        <dd class="mt-1 font-medium text-white">{{ projectIdentifier }}</dd>
                      </div>
                      <div>
                        <dt class="text-gray-400">{{ t('projects.modal.overview.customer') }}</dt>
                        <dd class="mt-1 font-medium text-white">{{ projectCustomerName }}</dd>
                      </div>
                      <div>
                        <dt class="text-gray-400">{{ t('projects.modal.overview.billingType') }}</dt>
                        <dd class="mt-1 font-medium text-white">{{ projectBillingType }}</dd>
                      </div>
                      <div>
                        <dt class="text-gray-400">{{ t('projects.modal.overview.ratePerHour') }}</dt>
                        <dd class="mt-1 font-medium text-white">{{ projectRatePerHour }}</dd>
                      </div>
                      <div>
                        <dt class="text-gray-400">{{ t('projects.modal.overview.dateCreated') }}</dt>
                        <dd class="mt-1 font-medium text-white">{{ formatDate(projectDetails?.date_c || projectDetails?.date_creation || selectedProject?.date_c) }}</dd>
                      </div>
                      <div>
                        <dt class="text-gray-400">{{ t('projects.modal.overview.startDate') }}</dt>
                        <dd class="mt-1 font-medium text-white">{{ formatDate(projectDetails?.date_start || selectedProject?.date_start) }}</dd>
                      </div>
                      <div>
                        <dt class="text-gray-400">{{ t('projects.modal.overview.deadline') }}</dt>
                        <dd class="mt-1 font-medium text-white">{{ formatDate(projectDetails?.date_end || selectedProject?.date_end) }}</dd>
                      </div>
                      <div>
                        <dt class="text-gray-400">{{ t('projects.modal.overview.loggedHours') }}</dt>
                        <dd class="mt-1 font-medium text-white">{{ projectLoggedHours }}</dd>
                      </div>
                    </dl>
                  </div>

                  <div class="rounded-2xl border border-gray-800/80 bg-gray-800/30 p-6">
                    <div class="flex items-center justify-between">
                      <h4 class="text-sm font-semibold uppercase tracking-wide text-gray-300">{{ t('projects.modal.labels.team') }}</h4>
                      <span v-if="contactsLoading" class="flex items-center gap-2 text-xs text-gray-400">
                        <svg class="h-4 w-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
                          <path class="opacity-75" d="M4 12a8 8 0 018-8" stroke-width="4" stroke-linecap="round"></path>
                        </svg>
                        {{ t('projects.modal.labels.loadingTeam') }}
                      </span>
                    </div>
                    <div v-if="projectTeamMembers.length" class="mt-4 space-y-4">
                      <div
                        v-for="member in projectTeamMembers"
                        :key="`member-${member.id}`"
                        class="flex items-center justify-between gap-3 rounded-xl border border-gray-700/60 bg-gray-900/40 px-4 py-3"
                      >
                        <div class="flex items-center gap-3">
                          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                            {{ member.initials }}
                          </div>
                          <div>
                            <p class="text-sm font-semibold text-white">{{ member.name }}</p>
                            <p v-if="member.role" class="text-xs text-emerald-300">{{ member.role }}</p>
                            <p v-else class="text-xs text-gray-500">{{ t('projects.modal.labels.teamMember') }}</p>
                            <div class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400">
                              <span v-if="member.email" class="inline-flex items-center gap-1">
                                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l9 6 9-6" />
                                </svg>
                                {{ member.email }}
                              </span>
                              <span v-if="member.phone" class="inline-flex items-center gap-1">
                                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5l2-2 4 4-2 2c1 2.5 3.5 5 6 6l2-2 4 4-2 2c-2.5.5-9-4-12-7-3-3-7-9.5-7-12z" />
                                </svg>
                                {{ member.phone }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button type="button" class="rounded-full border border-gray-600 px-3 py-1 text-xs font-medium text-gray-300 hover:bg-gray-700/80">{{ t('projects.modal.actions.more') }}</button>
                      </div>
                    </div>
                    <p v-else class="mt-4 text-xs text-gray-500">{{ t('projects.modal.labels.noTeam') }}</p>
                  </div>
                </div>

                <!-- Description -->
                <div class="rounded-2xl border border-gray-800/80 bg-gray-800/30 p-6">
                  <h4 class="text-sm font-semibold uppercase tracking-wide text-gray-300">{{ t('projects.modal.description') }}</h4>
                  <div class="mt-4 text-sm text-gray-200" v-if="projectDetails?.description" v-html="projectDetails.description"></div>
                  <p v-else class="mt-4 text-sm text-gray-500">{{ t('projects.modal.emptyDescription') }}</p>
                </div>
              </div>

              <div v-else class="rounded-2xl border border-gray-800/80 bg-gray-800/40 p-10 text-center text-sm text-gray-400">
                {{ t('projects.modal.comingSoon') }}
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-900/80 px-6 py-4 border-t border-gray-800/80">
            <div class="flex justify-end gap-3">
              <button @click="closeModal" type="button" class="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800/80 hover:text-white">
                {{ t('projects.modal.close') }}
              </button>
              <button type="button" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500">
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
import { useApiCache } from '../composables/useApiCache'

const { isDark } = useTheme()
const { t } = useI18n()
const { cachedFetch, hasCache, getCache } = useApiCache()

const projects = ref([])
const loading = ref(false)
const terceros = ref([])
const tercerosMap = ref({})
const categories = ref([])
const categoriesMap = ref({})
const activeModalTab = ref('overview')

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
const statusFilter = ref('')

const modalTabs = computed(() => [
  { id: 'overview', label: t('projects.modal.tabs.project'), icon: 'M6 12h12M6 16h12M6 8h12' },
  { id: 'contacts', label: t('projects.modal.tabs.contacts'), badge: projectContactsCount.value },
  { id: 'tasks', label: t('projects.modal.tabs.tasks'), badge: projectTasksSummary.value.total },
  { id: 'timesheets', label: t('projects.modal.tabs.timesheets'), badge: projectTimeEntriesCount.value },
  { id: 'summary', label: t('projects.modal.tabs.summary') },
  { id: 'tickets', label: t('projects.modal.tabs.tickets'), badge: projectTicketsCount.value },
  { id: 'notes', label: t('projects.modal.tabs.notes') },
  { id: 'documents', label: t('projects.modal.tabs.documents'), badge: projectDocumentsCount.value },
  { id: 'agenda', label: t('projects.modal.tabs.agenda') }
])

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
const projectContacts = ref([])
const contactsLoading = ref(false)

const projectTitle = computed(() => projectDetails.value?.title || selectedProject.value?.title || selectedProject.value?.ref || '')
const projectReferenceCode = computed(() => projectDetails.value?.ref || selectedProject.value?.ref || '-')
const projectCustomerName = computed(() => projectDetails.value?.thirdparty_name || selectedProject.value?.thirdparty_name || '—')
const projectModalTags = computed(() => {
  if (projectDetails.value) return getProjectTags(projectDetails.value)
  if (selectedProject.value) return getProjectTags(selectedProject.value)
  return []
})
const projectTeamMembers = computed(() => {
  if (projectContacts.value.length > 0) {
    return projectContacts.value
  }
  return getProjectMembers(projectDetails.value || selectedProject.value || {})
})
const projectProgress = computed(() => calculateProjectProgress(projectDetails.value || selectedProject.value))
const projectTasksSummary = computed(() => calculateTasksSummary(projectDetails.value || selectedProject.value))
const projectDeadlineSummary = computed(() => calculateDeadlineSummary(projectDetails.value || selectedProject.value))
const projectLoggedHours = computed(() => formatDuration(projectDetails.value?.total_logged_hours || projectDetails.value?.totalhours || selectedProject.value?.total_logged_hours))
const projectBudgetAmount = computed(() => {
  const amount = projectDetails.value?.budget_amount || selectedProject.value?.budget_amount
  return amount ? formatCurrency(amount) : '—'
})
const currentProject = computed(() => projectDetails.value || selectedProject.value || null)
const projectStatusValue = computed(() => getProjectStatusValue(currentProject.value || {}))
const projectStatusText = computed(() => getStatusText(projectStatusValue.value))
const projectStatusBadgeClass = computed(() => getStatusBadgeClass(projectStatusValue.value))
const projectStatusDotClass = computed(() => getStatusDotClass(projectStatusValue.value))
const projectIdentifier = computed(() => currentProject.value?.id || currentProject.value?.ref || '—')
const projectBillingType = computed(() => {
  if (!currentProject.value) return t('projects.modal.billingTypes.projectHours')
  const type = currentProject.value.billing_type || currentProject.value.bill_type
  if (type && billingTypeLabels[type]) {
    return billingTypeLabels[type]
  }

  if (currentProject.value.usage_bill_time) {
    return t('projects.modal.billingTypes.projectHours')
  }

  return t('projects.modal.billingTypes.notSet')
})
const projectRatePerHour = computed(() => {
  const rate = currentProject.value?.rate_per_hour || currentProject.value?.hourly_rate || currentProject.value?.rate
  if (!rate) return t('projects.modal.billingTypes.notSet')
  return formatCurrency(rate)
})
const projectContactsCount = computed(() => {
  const contacts = currentProject.value?.contacts_ids_internal || currentProject.value?.contacts || currentProject.value?.linkedContacts
  if (Array.isArray(contacts)) return contacts.length
  const count = currentProject.value?.nb_contacts || currentProject.value?.contacts_count
  return Number.isFinite(Number(count)) ? Number(count) : 0
})
const projectTimeEntriesCount = computed(() => {
  const entries = currentProject.value?.time_entries || currentProject.value?.timesheets
  if (Array.isArray(entries)) return entries.length
  const count = currentProject.value?.nb_time_entries || currentProject.value?.time_spent_count
  return Number.isFinite(Number(count)) ? Number(count) : 0
})
const projectTicketsCount = computed(() => {
  const tickets = currentProject.value?.tickets || currentProject.value?.linkedTickets
  if (Array.isArray(tickets)) return tickets.length
  const count = currentProject.value?.nb_tickets || currentProject.value?.ticket_count
  return Number.isFinite(Number(count)) ? Number(count) : 0
})
const projectDocumentsCount = computed(() => {
  const documents = currentProject.value?.documents || currentProject.value?.files
  if (Array.isArray(documents)) return documents.length
  const count = currentProject.value?.nb_documents || currentProject.value?.document_count
  return Number.isFinite(Number(count)) ? Number(count) : 0
})

const normalizeCollection = (collection) => {
  if (Array.isArray(collection)) {
    return collection
  }

  if (collection && Array.isArray(collection.data)) {
    return collection.data
  }

  return []
}

const enrichAndSetProjects = (projectsData = [], tercerosData = [], categoriesData = []) => {
  const normalizedProjects = normalizeCollection(projectsData)
  const normalizedThirdparties = normalizeCollection(tercerosData)
  const normalizedCategories = normalizeCollection(categoriesData)

  terceros.value = normalizedThirdparties
  categories.value = normalizedCategories

  const tercerosLookup = {}
  normalizedThirdparties.forEach(tercero => {
    const idVariants = [tercero.id, String(tercero.id), Number(tercero.id)]
    idVariants.forEach(id => {
      if (id !== undefined && id !== null && id !== 'undefined' && id !== 'null') {
        tercerosLookup[id] = tercero
      }
    })
  })
  tercerosMap.value = tercerosLookup

  const categoriesLookup = {}
  normalizedCategories.forEach(category => {
    const idVariants = [category.id, String(category.id), Number(category.id)]
    idVariants.forEach(id => {
      if (id !== undefined && id !== null && id !== 'undefined' && id !== 'null') {
        categoriesLookup[id] = category
      }
    })
  })
  categoriesMap.value = categoriesLookup

  const enrichedProjects = normalizedProjects.map(project => {
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
}

const prefillProjectsFromCache = () => {
  if (!projects.value.length && hasCache('projects:list')) {
    const cachedProjects = getCache('projects:list')
    const cachedThirdparties = getCache('thirdparties:active')
    const cachedCategories = getCache('categories:project')

    if (cachedProjects?.data?.length) {
      enrichAndSetProjects(
        cachedProjects.data,
        cachedThirdparties?.data || cachedThirdparties,
        cachedCategories?.data || cachedCategories
      )
    }
  }
}

const fetchProjects = async () => {
  loading.value = true
  try {
    const [projectsResponse, tercerosResponse, categoriesResponse] = await Promise.all([
      cachedFetch('/api/doli/projects', {
        params: { limit: 500, sortfield: 'datec', sortorder: 'DESC' },
        ttl: 600000,
        cacheKey: 'projects:list'
      }),
      cachedFetch('/api/doli/thirdparties', {
        params: { limit: 1000, status: 1 },
        ttl: 600000,
        cacheKey: 'thirdparties:active'
      }).catch(error => {
        console.warn('⚠️ Error fetching thirdparties, using empty list', error)
        return { data: [] }
      }),
      cachedFetch('/api/doli/categories', {
        params: { type: 'project', limit: 1000 },
        ttl: 600000,
        cacheKey: 'categories:project'
      }).catch(error => {
        console.warn('⚠️ Error fetching categories, using empty list', error)
        return { data: [] }
      })
    ])

    enrichAndSetProjects(
      projectsResponse.data || projectsResponse,
      tercerosResponse.data || tercerosResponse,
      categoriesResponse?.data || categoriesResponse
    )
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
const fetchProjectContacts = async (projectId) => {
  if (!projectId) return []
  contactsLoading.value = true
  try {
    const response = await http.get(`/api/doli/dolibarrmodernfrontendapi/projects/${projectId}/contacts`, {
      params: { limit: 200 }
    })

    const payload = response?.data ?? []
    const contacts = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.contacts)
          ? payload.contacts
          : []

    return contacts
      .map((contact, index) => normalizeProjectContact(contact, projectId, index))
      .filter(Boolean)
  } catch (error) {
    console.warn('⚠️ Error fetching project contacts', error)
    return []
  } finally {
    contactsLoading.value = false
  }
}

const viewProjectDetails = async (project) => {
  selectedProject.value = project
  showModal.value = true
  loadingDetails.value = true
  activeModalTab.value = 'overview'
  projectContacts.value = []
  
  try {
    const response = await http.get(`/api/doli/projects/${project.id}`)
    const details = response.data
    details.category_ids = extractCategoryIds(details)
    if (!details.thirdparty_name) {
      details.thirdparty_name = extractThirdpartyName(resolveThirdparty(details.socid ?? details.fk_soc))
    }
    projectDetails.value = details

    const contacts = await fetchProjectContacts(project.id)
    projectContacts.value = contacts
  } catch (error) {
    console.error('Error fetching project details:', error)
    projectDetails.value = {
      ...project,
      category_ids: extractCategoryIds(project),
      thirdparty_name: project.thirdparty_name || extractThirdpartyName(resolveThirdparty(project.socid ?? project.fk_soc))
    }
    projectContacts.value = await fetchProjectContacts(project.id)
  } finally {
    loadingDetails.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  selectedProject.value = null
  projectDetails.value = null
  loadingDetails.value = false
  activeModalTab.value = 'overview'
  projectContacts.value = []
}

const formatDate = (dateString) => {
  const date = normalizeDate(dateString)
  if (!date) return '—'
  return date.toLocaleDateString('es-ES')
}

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || amount === '') return '—'
  const numeric = Number(amount)
  if (!Number.isFinite(numeric)) return '—'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(numeric)
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

const normalizeProjectContact = (contact, projectId, index = 0) => {
  if (!contact || typeof contact !== 'object') return null

  const nestedContact = contact.contact || contact.linked_contact || contact.user || contact.member || {}
  const firstName = contact.firstname ?? nestedContact.firstname ?? ''
  const lastName = contact.lastname ?? nestedContact.lastname ?? ''
  const compositeName = `${firstName} ${lastName}`.trim()
  const fallbackName = contact.name || nestedContact.name || contact.fullname || nestedContact.fullname || compositeName
  const email = contact.email || nestedContact.email || contact.mail || nestedContact.mail || null
  const phone = contact.phone || contact.phone_mobile || nestedContact.phone || nestedContact.phone_mobile || nestedContact.phone_pro || null
  const role = contact.role || contact.libelle || contact.label || contact.type_label || contact.position || contact.function || nestedContact.position || null

  const resolvedName = fallbackName || email || contact.login || nestedContact.login || t('projects.modal.labels.teamMember')

  return {
    id: contact.id || contact.fk_contact || contact.contactid || nestedContact.id || `contact-${projectId}-${index}`,
    name: resolvedName,
    initials: getInitials(resolvedName),
    role,
    email,
    phone
  }
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

const calculateProjectProgress = (project) => {
  if (!project) return 0
  const raw = project.opp_percent ?? project.progress ?? project.usage_bill_time ?? project.progress_percent
  const numeric = Number(raw)
  if (Number.isFinite(numeric)) {
    return Math.min(100, Math.max(0, Math.round(numeric)))
  }
  return 0
}

const billingTypeLabels = {
  time: t('projects.modal.billingTypes.projectHours'),
  hour: t('projects.modal.billingTypes.projectHours'),
  fixed: t('projects.modal.billingTypes.fixedPrice'),
  fixed_price: t('projects.modal.billingTypes.fixedPrice')
}

const calculateTasksSummary = (project) => {
  if (!project) {
    return { open: null, total: null, completion: 0 }
  }
  const open = Number(project.tasks_open ?? project.todo_task ?? project.nb_tasks_todo ?? project.open_tasks)
  const total = Number(project.tasks_total ?? project.nb_tasks ?? project.total_tasks)

  if (!Number.isFinite(open) || !Number.isFinite(total) || total <= 0) {
    return { open: null, total: null, completion: 0 }
  }

  const completed = Math.max(total - open, 0)
  const completion = Math.min(100, Math.max(0, Math.round((completed / total) * 100)))
  return { open, total, completion }
}

const calculateDeadlineSummary = (project) => {
  if (!project) {
    return { daysLeft: null, percent: null }
  }

  const endDate = project.date_end || project.datee || project.date_close
  const startDate = project.date_start || project.dateo || project.date_creation

  if (!endDate) {
    return { daysLeft: null, percent: null }
  }

  const end = normalizeDate(endDate)
  if (!end) {
    return { daysLeft: null, percent: null }
  }

  const today = new Date()
  const diffMs = end.getTime() - today.getTime()
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (!startDate) {
    return { daysLeft, percent: null }
  }

  const start = normalizeDate(startDate)
  if (!start) {
    return { daysLeft, percent: null }
  }

  const totalDuration = end.getTime() - start.getTime()
  if (totalDuration <= 0) {
    return { daysLeft, percent: null }
  }

  const elapsed = today.getTime() - start.getTime()
  const progress = Math.min(1, Math.max(0, elapsed / totalDuration))
  return { daysLeft, percent: Math.round(progress * 100) }
}

const normalizeDate = (value) => {
  if (!value) return null
  const parsed = Number(value)
  if (Number.isFinite(parsed)) {
    const timestamp = parsed < 10000000000 ? parsed * 1000 : parsed
    return new Date(timestamp)
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const formatDuration = (value) => {
  if (!value && value !== 0) return '00:00'

  if (typeof value === 'string' && value.includes(':')) {
    return value
  }

  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    return '00:00'
  }

  // Assume value is in hours if > 24, otherwise treat as hours
  const totalMinutes = numeric > 24 ? Math.round(numeric) : Math.round(numeric * 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

watch(showModal, (isOpen) => {
  if (!isOpen) {
    activeModalTab.value = 'overview'
  }
})

const normalizeProjectStatus = (value) => {
  if (value === undefined || value === null) return '0'
  const strValue = String(value)
  if (strValue === '1') return '1'
  if (strValue === '2') return '2'
  return '0'
}

const getProjectStatusValue = (project = {}) => normalizeProjectStatus(project.normalizedStatus ?? project.status ?? project.fk_statut ?? project.statut)

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
  prefillProjectsFromCache()
  fetchProjects()
})
</script>
