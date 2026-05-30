<template>
  <Modal v-model="state.visible" :title="state.title ?? 'Confirm'" size="sm">
    <p class="text-base-content/80">{{ state.message }}</p>
    <template #footer>
      <button class="btn btn-ghost btn-sm" @click="reject">
        {{ state.cancelText ?? 'Cancel' }}
      </button>
      <button
        class="btn btn-sm"
        :class="state.type === 'danger' ? 'btn-error' : state.type === 'warning' ? 'btn-warning' : 'btn-primary'"
        @click="accept"
      >
        {{ state.confirmText ?? 'Confirm' }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'
import { useConfirm } from '@/shared/composables/useConfirm'

const { state, accept, reject } = useConfirm()
</script>
