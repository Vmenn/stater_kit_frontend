import apiClient from '../../../core/api/axios'
import type { ApiResponse, PaginatedResponse } from '../../../shared/types/shared.types'
import type { CmsContent, CreateContentRequest, UpdateContentRequest } from '../types/cms.types'

export const cmsApi = {
  async getContents(params: { page?: number; size?: number; search?: string } = {}): Promise<PaginatedResponse<CmsContent>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<CmsContent>>>('/cms/contents', { params })
    return data.data!
  },

  async getContent(id: string): Promise<CmsContent> {
    const { data } = await apiClient.get<ApiResponse<CmsContent>>(`/cms/contents/${id}`)
    return data.data!
  },

  async createContent(payload: CreateContentRequest): Promise<CmsContent> {
    const { data } = await apiClient.post<ApiResponse<CmsContent>>('/cms/contents', payload)
    return data.data!
  },

  async updateContent(id: string, payload: UpdateContentRequest): Promise<CmsContent> {
    const { data } = await apiClient.put<ApiResponse<CmsContent>>(`/cms/contents/${id}`, payload)
    return data.data!
  },

  async deleteContent(id: string): Promise<void> {
    await apiClient.delete(`/cms/contents/${id}`)
  },

  async uploadMedia(file: File): Promise<{ url: string; fileName: string }> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await apiClient.post<ApiResponse<{ url: string; fileName: string }>>(
      '/cms/media/upload',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return data.data!
  },
}
