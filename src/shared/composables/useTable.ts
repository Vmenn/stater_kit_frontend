import { ref, reactive, computed } from 'vue'
import type { PageResponse } from '../types/shared.types'
import { DEFAULT_PAGE_SIZE, DEBOUNCE_DELAY } from '../constants/app.constants'

export function useTable<T>(
  fetcher: (params: Record<string, unknown>) => Promise<PageResponse<T>>,
) {
  const data = ref<T[]>([]) as ReturnType<typeof ref<T[]>>
  const totalElements = ref(0)
  const totalPages = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const state = reactive({
    page: 0,
    size: DEFAULT_PAGE_SIZE,
    sort: 'createdAt',
    direction: 'desc' as 'asc' | 'desc',
    search: '',
  })

  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  async function fetchData() {
    isLoading.value = true
    error.value = null
    try {
      const params: Record<string, unknown> = {
        page: state.page,
        size: state.size,
        sort: `${state.sort},${state.direction}`,
      }
      if (state.search) params.search = state.search

      const response = await fetcher(params)
      data.value = response.content
      totalElements.value = response.totalElements
      totalPages.value = response.totalPages
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load data'
    } finally {
      isLoading.value = false
    }
  }

  function setPage(page: number) {
    state.page = page
    fetchData()
  }

  function setSearch(search: string) {
    if (searchTimeout) clearTimeout(searchTimeout)
    state.search = search
    state.page = 0
    searchTimeout = setTimeout(fetchData, DEBOUNCE_DELAY)
  }

  function setSort(column: string) {
    if (state.sort === column) {
      state.direction = state.direction === 'asc' ? 'desc' : 'asc'
    } else {
      state.sort = column
      state.direction = 'asc'
    }
    fetchData()
  }

  const isEmpty = computed(() => !isLoading.value && data.value.length === 0)

  return {
    data,
    totalElements,
    totalPages,
    isLoading,
    error,
    state,
    isEmpty,
    fetchData,
    setPage,
    setSearch,
    setSort,
  }
}
