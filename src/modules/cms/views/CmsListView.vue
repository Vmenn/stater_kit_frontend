<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Content Management</h1>
        <p class="text-sm text-base-content/60">Manage your published content</p>
      </div>
      <button class="btn btn-primary btn-sm" @click="openCreate">
        + New Content
      </button>
    </div>

    <!-- Search -->
    <div class="flex gap-2">
      <input
        v-model="search"
        type="search"
        placeholder="Search content…"
        class="input input-bordered input-sm w-64"
        @input="onSearch"
      />
      <select v-model="statusFilter" class="select select-bordered select-sm" @change="onSearch">
        <option value="">All Status</option>
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
        <option value="ARCHIVED">Archived</option>
      </select>
    </div>

    <!-- Table -->
    <DataTable
      :columns="columns"
      :data="cmsStore.contents"
      :loading="cmsStore.isLoading"
      :total="cmsStore.total"
      :page="cmsStore.page"
      :page-size="cmsStore.pageSize"
      @page-change="onPageChange"
      @row-click="onEdit"
    />

    <!-- Create/Edit Drawer -->
    <Drawer v-model="drawerOpen" :title="editing ? 'Edit Content' : 'New Content'">
      <form @submit.prevent="onSave" class="space-y-4 p-4">
        <div class="form-control">
          <label class="label"><span class="label-text">Title</span></label>
          <input v-model="form.title" class="input input-bordered" @input="autoSlug" required />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">Slug</span></label>
          <input v-model="form.slug" class="input input-bordered input-sm font-mono" required />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">Excerpt</span></label>
          <textarea v-model="form.excerpt" class="textarea textarea-bordered" rows="2" />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">Body</span></label>
          <RichTextEditor v-model="form.body" />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">Status</span></label>
          <select v-model="form.status" class="select select-bordered">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="form-control">
            <label class="label"><span class="label-text text-xs">Meta Title</span></label>
            <input v-model="form.metaTitle" class="input input-bordered input-sm" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text text-xs">Meta Description</span></label>
            <input v-model="form.metaDescription" class="input input-bordered input-sm" />
          </div>
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
import { ref, reactive } from 'vue'
import slugify from 'slugify'
import { useCmsStore } from '../store/cms.store'
import type { CmsContent } from '../types/cms.types'
import DataTable from '@/shared/components/DataTable.vue'
import Drawer from '@/shared/components/Drawer.vue'
import RichTextEditor from '../components/RichTextEditor.vue'
import { useToast } from '@/shared/composables/useToast'
import { formatDate } from '@/shared/helpers/date.helper'

const cmsStore = useCmsStore()
const { success, error } = useToast()

const search = ref('')
const statusFilter = ref('')
const drawerOpen = ref(false)
const editing = ref<CmsContent | null>(null)
const saving = ref(false)

type FormState = {
  title: string; slug: string; body: string; excerpt: string
  status: CmsContent['status']; metaTitle: string; metaDescription: string
}

const form = reactive<FormState>({
  title: '', slug: '', body: '', excerpt: '', status: 'DRAFT', metaTitle: '', metaDescription: '',
})

const columns = [
  { header: 'Title',     key: 'title',     sortable: true },
  { header: 'Slug',      key: 'slug' },
  { header: 'Status',    key: 'status',    formatter: (v: string) => v },
  { header: 'Created',   key: 'createdAt', formatter: (v: string) => formatDate(v) },
]

cmsStore.fetchContents()

function resetForm() {
  Object.assign(form, { title: '', slug: '', body: '', excerpt: '', status: 'DRAFT', metaTitle: '', metaDescription: '' })
  editing.value = null
}

function openCreate() {
  resetForm()
  drawerOpen.value = true
}

function onEdit(row: CmsContent) {
  editing.value = row
  Object.assign(form, {
    title: row.title,
    slug: row.slug,
    body: row.body,
    excerpt: row.excerpt ?? '',
    status: row.status,
    metaTitle: row.metaTitle ?? '',
    metaDescription: row.metaDescription ?? '',
  })
  drawerOpen.value = true
}

function autoSlug() {
  form.slug = slugify(form.title, { lower: true, strict: true })
}

async function onSave() {
  saving.value = true
  try {
    if (editing.value) {
      await cmsStore.updateContent(editing.value.id, { ...form })
      success('Content updated')
    } else {
      await cmsStore.createContent({ ...form })
      success('Content created')
    }
    drawerOpen.value = false
    resetForm()
  } catch {
    error('Failed to save content')
  } finally {
    saving.value = false
  }
}

async function onDelete() {
  if (!editing.value) return
  try {
    await cmsStore.deleteContent(editing.value.id)
    success('Content deleted')
    drawerOpen.value = false
    resetForm()
  } catch {
    error('Failed to delete content')
  }
}

let searchTimer: ReturnType<typeof setTimeout>
function onSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => cmsStore.fetchContents(search.value), 400)
}

function onPageChange(p: number) {
  cmsStore.page = p
  cmsStore.fetchContents(search.value)
}
</script>
