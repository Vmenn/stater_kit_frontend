<template>
  <div class="relative inline-block" ref="containerRef">
    <div @click="toggle">
      <slot name="trigger" :open="isOpen" />
    </div>
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-1 rounded-box bg-base-100 shadow-lg ring-1 ring-base-content/10 min-w-[160px]"
        :class="[alignClass, widthClass]"
      >
        <ul class="menu menu-sm p-1">
          <slot :close="close" />
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  align?: 'left' | 'right'
  width?: 'auto' | 'full'
}>(), {
  align: 'left',
  width: 'auto',
})

const isOpen = ref(false)
const containerRef = ref<HTMLElement>()

const alignClass = computed(() =>
  props.align === 'right' ? 'right-0' : 'left-0',
)
const widthClass = computed(() =>
  props.width === 'full' ? 'w-full' : '',
)

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function handleOutsideClick(e: MouseEvent) {
  if (!containerRef.value?.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleOutsideClick, true))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick, true))
</script>
