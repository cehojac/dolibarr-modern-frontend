<template>
  <div class="animate-pulse">
    <!-- Table skeleton -->
    <div v-if="type === 'table'" class="space-y-4">
      <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/4"></div>
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div class="bg-gray-100 dark:bg-gray-800 p-4">
          <div class="grid grid-cols-4 gap-4">
            <div class="bg-gray-200 dark:bg-gray-700 h-3 rounded"></div>
            <div class="bg-gray-200 dark:bg-gray-700 h-3 rounded"></div>
            <div class="bg-gray-200 dark:bg-gray-700 h-3 rounded"></div>
            <div class="bg-gray-200 dark:bg-gray-700 h-3 rounded"></div>
          </div>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div v-for="n in rows" :key="n" class="p-4">
            <div class="grid grid-cols-4 gap-4">
              <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded"></div>
              <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
              <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/2"></div>
              <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Card grid skeleton -->
    <div v-else-if="type === 'cards'" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in rows" :key="n" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div class="bg-gray-200 dark:bg-gray-700 h-5 rounded w-2/3"></div>
          <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded-full w-16"></div>
        </div>
        <div class="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2"></div>
        <div class="space-y-2">
          <div class="bg-gray-200 dark:bg-gray-700 h-3 rounded"></div>
          <div class="bg-gray-200 dark:bg-gray-700 h-3 rounded w-4/5"></div>
        </div>
        <div class="bg-gray-200 dark:bg-gray-700 h-6 rounded w-1/3"></div>
      </div>
    </div>

    <!-- List skeleton -->
    <div v-else-if="type === 'list'" class="space-y-4">
      <div v-for="n in rows" :key="n" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div class="flex items-start space-x-4">
          <div class="bg-gray-200 dark:bg-gray-700 h-12 w-12 rounded-lg"></div>
          <div class="flex-1 space-y-2">
            <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
            <div class="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2"></div>
            <div class="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
          </div>
          <div class="bg-gray-200 dark:bg-gray-700 h-8 w-16 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Dashboard cards skeleton -->
    <div v-else-if="type === 'dashboard'" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in rows" :key="n" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div class="p-5">
          <div class="flex items-center">
            <div class="bg-gray-200 dark:bg-gray-700 h-8 w-8 rounded-md"></div>
            <div class="ml-5 flex-1 space-y-2">
              <div class="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
              <div class="bg-gray-200 dark:bg-gray-700 h-5 rounded w-1/3"></div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-5 py-3">
          <div class="bg-gray-200 dark:bg-gray-600 h-3 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Default skeleton -->
    <div v-else class="space-y-4">
      <div v-for="n in rows" :key="n" class="bg-gray-200 dark:bg-gray-700 h-4 rounded w-full"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['table', 'cards', 'list', 'dashboard', 'default'].includes(value)
  },
  rows: {
    type: Number,
    default: 5
  }
})
</script>
