<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">User Management</h1>
        <p class="text-sm text-base-content/60">Manage all registered users</p>
      </div>
      <button class="btn btn-primary btn-sm" @click="openCreate">+ Add User</button>
    </div>

    <!-- Search -->
    <div class="flex gap-2">
      <input
        v-model="search"
        type="search"
        placeholder="Search by name or email…"
        class="input input-bordered input-sm w-72"
        @input="onSearch"
      />
    </div>

    <!-- Table -->
    <DataTable
      :columns="columns"
      :data="users"
      :loading="loading"
      :total="total"
      :page="page"
      :page-size="pageSize"
      @page-change="onPageChange"
      @row-click="onEdit"
    />

    <!-- Drawer -->
    <Drawer v-model="drawerOpen" :title="editing ? 'Edit User' : 'New User'">
      <form @submit.prevent="onSave" class="space-y-4 p-4">
        <div class="form-control">
          <label class="label"><span class="label-text">Full Name</span></label>
          <input v-model="form.name" class="input input-bordered" required />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">Email</span></label>
          <input v-model="form.email" type="email" class="input input-bordered" required />
        </div>
        <div v-if="!editing" class="form-control">
          <label class="label"><span class="label-text">Password</span></label>
          <input v-model="form.password" type="password" class="input input-bordered" required />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">Role</span></label>
          <select v-model="form.role" class="select select-bordered">
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="btn btn-ghost btn-sm" @click="drawerOpen = false">Cancel</button>
          <button
            v-if="editing"
            type="button"
            class="btn btn-error btn-sm"
            @click="onDelete"
          >Delete</button>
          <button type="submit" class="btn btn-primary btn-sm" :disabled="saving">
            <span v-if="saving" class="loading loading-spinner loading-xs" />
            {{ editing ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { userService, type CreateUserRequest } from '@/core/services/user.service'
import type { User } from '@/modules/auth/types/auth.types'
import DataTable from '@/shared/components/DataTable.vue'
import Drawer from '@/shared/components/Drawer.vue'
import { useToast } from '@/shared/composables/useToast'
import { formatDate } from '@/shared/helpers/date.helper'

const { success, error } = useToast()

const users = ref<User[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(0)
const pageSize = ref(20)
const search = ref('')
const drawerOpen = ref(false)
const editing = ref<User | null>(null)
const saving = ref(false)

const form = reactive<CreateUserRequest & { role: User['role'] }>({
  name: '', email: '', password: '', role: 'USER',
})

const columns = [
  { header: 'Name',    key: 'name',      sortable: true },
  { header: 'Email',   key: 'email' },
  { header: 'Role',    key: 'role' },
  { header: 'Active',  key: 'isActive',  formatter: (v: boolean) => v ? 'Yes' : 'No' },
  { header: 'Joined',  key: 'createdAt', formatter: (v: string) => formatDate(v) },
]

onMounted(fetchUsers)

async function fetchUsers() {
  loading.value = true
  try {
    const result = await userService.getUsers({ page: page.value, size: pageSize.value, search: search.value || undefined })
    users.value = result.content
    total.value = result.totalElements
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  Object.assign(form, { name: '', email: '', password: '', role: 'USER' })
  drawerOpen.value = true
}

function onEdit(row: User) {
  editing.value = row
  Object.assign(form, { name: row.name, email: row.email, password: '', role: row.role })
  drawerOpen.value = true
}

async function onSave() {
  saving.value = true
  try {
    if (editing.value) {
      await userService.updateUser(editing.value.id, { name: form.name, role: form.role })
      success('User updated')
    } else {
      await userService.createUser(form)
      success('User created')
    }
    drawerOpen.value = false
    await fetchUsers()
  } catch {
    error('Failed to save user')
  } finally {
    saving.value = false
  }
}

async function onDelete() {
  if (!editing.value) return
  try {
    await userService.deleteUser(editing.value.id)
    success('User deleted')
    drawerOpen.value = false
    await fetchUsers()
  } catch {
    error('Failed to delete user')
  }
}

let searchTimer: ReturnType<typeof setTimeout>
function onSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(fetchUsers, 400)
}

function onPageChange(p: number) {
  page.value = p
  fetchUsers()
}
</script>
