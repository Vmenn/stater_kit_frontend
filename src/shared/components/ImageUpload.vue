<template>
  <div>
    <div
      class="relative border-2 border-dashed rounded-xl transition-colors"
      :class="isDragging ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50'"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <!-- Preview -->
      <div v-if="previewUrl" class="relative">
        <img :src="previewUrl" class="w-full h-48 object-cover rounded-xl" alt="Preview" />
        <button
          class="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
          @click="clearFile"
        >✕</button>
      </div>

      <!-- Upload area -->
      <div v-else class="flex flex-col items-center justify-center py-10 px-4 cursor-pointer" @click="triggerInput">
        <PhotoIcon class="h-10 w-10 text-base-content/30 mb-2" />
        <p class="text-sm font-medium">Drop image here or <span class="text-primary">browse</span></p>
        <p class="text-xs text-base-content/50 mt-1">PNG, JPG, WEBP up to 5MB</p>
      </div>

      <input ref="inputRef" type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="handleFileChange" />
    </div>

    <!-- Upload progress -->
    <div v-if="isUploading" class="mt-2">
      <div class="flex justify-between text-xs mb-1">
        <span>Uploading...</span>
        <span>{{ progress }}%</span>
      </div>
      <progress class="progress progress-primary w-full" :value="progress" max="100"></progress>
    </div>

    <!-- Error -->
    <p v-if="error" class="input-error-msg mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PhotoIcon } from '@heroicons/vue/24/outline'
import { MAX_UPLOAD_SIZE, ALLOWED_IMAGE_TYPES } from '@/shared/constants/app.constants'

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
  (e: 'upload-complete', url: string): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const progress = ref(0)
const error = ref<string | null>(null)

function triggerInput() {
  inputRef.value?.click()
}

function clearFile() {
  previewUrl.value = null
  error.value = null
  if (inputRef.value) inputRef.value.value = ''
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) processFile(file)
}

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) processFile(file)
}

async function processFile(file: File) {
  error.value = null

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    error.value = 'Invalid file type. Only JPG, PNG, and WEBP are allowed.'
    return
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    error.value = 'File too large. Maximum size is 5MB.'
    return
  }

  const compressed = file.size > 1_000_000 ? await compressImage(file) : file
  previewUrl.value = URL.createObjectURL(compressed)
  emit('file-selected', compressed)
}

async function compressImage(file: File): Promise<File> {
  return new Promise(resolve => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      const MAX_DIM = 1200
      let { width, height } = img
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) { height = Math.round(height * MAX_DIM / width); width = MAX_DIM }
        else { width = Math.round(width * MAX_DIM / height); height = MAX_DIM }
      }
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        if (blob) resolve(new File([blob], file.name, { type: file.type }))
        else resolve(file)
      }, file.type, 0.85)
    }
    img.src = url
  })
}
</script>
