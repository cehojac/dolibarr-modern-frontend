import { ref, computed } from 'vue'

export function usePagination(initialPerPage = 20) {
  const currentPage = ref(1)
  const perPage = ref(initialPerPage)
  const total = ref(0)
  const data = ref([])
  const loading = ref(false)

  const totalPages = computed(() => {
    return Math.ceil(total.value / perPage.value)
  })

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value
    return data.value.slice(start, end)
  })

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const setData = (newData) => {
    data.value = newData
    total.value = newData.length
    // Reset to first page if current page is beyond available pages
    if (currentPage.value > totalPages.value) {
      currentPage.value = 1
    }
  }

  const reset = () => {
    currentPage.value = 1
    total.value = 0
    data.value = []
  }

  return {
    currentPage,
    perPage,
    total,
    totalPages,
    data,
    paginatedData,
    loading,
    goToPage,
    setData,
    reset
  }
}
