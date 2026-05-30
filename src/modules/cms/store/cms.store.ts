import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cmsApi } from '../api/cms.api'
import type { CmsContent, CreateContentRequest, UpdateContentRequest } from '../types/cms.types'
import type { PaginatedResponse } from '../../../shared/types/shared.types'

export const useCmsStore = defineStore('cms', () => {
  const contents = ref<CmsContent[]>([])
  const currentContent = ref<CmsContent | null>(null)
  const isLoading = ref(false)
  const total = ref(0)
  const page = ref(0)
  const pageSize = ref(20)

  async function fetchContents(search?: string) {
    isLoading.value = true
    try {
      const result: PaginatedResponse<CmsContent> = await cmsApi.getContents({
        page: page.value,
        size: pageSize.value,
        search,
      })
      contents.value = result.content ?? (result as unknown as CmsContent[])
      total.value = (result as { totalElements?: number }).totalElements ?? (result as unknown as CmsContent[]).length
    } finally {
      isLoading.value = false
    }
  }

  async function fetchContent(id: string) {
    isLoading.value = true
    try {
      currentContent.value = await cmsApi.getContent(id)
    } finally {
      isLoading.value = false
    }
  }

  async function createContent(payload: CreateContentRequest): Promise<CmsContent> {
    const result = await cmsApi.createContent(payload)
    contents.value.unshift(result)
    total.value++
    return result
  }

  async function updateContent(id: string, payload: UpdateContentRequest): Promise<CmsContent> {
    const result = await cmsApi.updateContent(id, payload)
    const idx = contents.value.findIndex(c => c.id === id)
    if (idx !== -1) contents.value[idx] = result
    if (currentContent.value?.id === id) currentContent.value = result
    return result
  }

  async function deleteContent(id: string) {
    await cmsApi.deleteContent(id)
    contents.value = contents.value.filter(c => c.id !== id)
    total.value--
  }

  return {
    contents,
    currentContent,
    isLoading,
    total,
    page,
    pageSize,
    fetchContents,
    fetchContent,
    createContent,
    updateContent,
    deleteContent,
  }
})
