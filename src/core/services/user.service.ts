import apiClient from '../api/axios'
import type { User } from '../../modules/auth/types/auth.types'
import type { ApiResponse, PageResponse } from '../../shared/types/shared.types'

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role?: User['role']
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: User['role']
}

export interface GetUsersParams {
  page?: number
  size?: number
  search?: string
  sort?: string
}

export const userService = {
  async getUsers(params: GetUsersParams = {}): Promise<PageResponse<User>> {
    const { data } = await apiClient.get<ApiResponse<PageResponse<User>>>('/users', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        ...(params.search ? { search: params.search } : {}),
        ...(params.sort ? { sort: params.sort } : {}),
      },
    })
    return data.data ?? { content: [], totalElements: 0, totalPages: 0, number: 0, size: 20, first: true, last: true }
  },

  async getUser(id: string): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`)
    return data.data!
  },

  async createUser(payload: CreateUserRequest): Promise<User> {
    const { data } = await apiClient.post<ApiResponse<User>>('/users', payload)
    return data.data!
  },

  async updateUser(id: string, payload: UpdateUserRequest): Promise<User> {
    const { data } = await apiClient.put<ApiResponse<User>>(`/users/${id}`, payload)
    return data.data!
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`)
  },

  async getProfileImage(userId: string): Promise<string> {
    const { data } = await apiClient.get<Blob>(`/images/${userId}`, {
      responseType: 'blob',
    })
    return URL.createObjectURL(data)
  },

  async uploadImage(file: File, onProgress?: (percent: number) => void): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await apiClient.post<ApiResponse<{ url: string }>>('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          onProgress(percent)
        }
      },
    })
    return data.data ?? { url: '' }
  },
}
