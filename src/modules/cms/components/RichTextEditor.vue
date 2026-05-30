<template>
  <div class="border border-base-300 rounded-lg overflow-hidden">
    <!-- Toolbar -->
    <div class="bg-base-200 border-b border-base-300 p-2 flex flex-wrap gap-1">
      <button
        v-for="action in toolbarActions"
        :key="action.label"
        type="button"
        class="btn btn-xs"
        :class="action.isActive?.() ? 'btn-primary' : 'btn-ghost'"
        :title="action.label"
        @click="action.command"
      >
        {{ action.icon }}
      </button>

      <div class="divider divider-horizontal mx-1 h-6 self-center" />

      <select
        class="select select-xs select-bordered"
        @change="onHeadingChange"
      >
        <option value="0">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>
    </div>

    <!-- Editor Content -->
    <EditorContent
      :editor="editor"
      class="prose max-w-none p-4 min-h-[200px] focus-within:outline-none"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false }),
    Image,
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (val) => {
  if (editor.value && editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val, false)
  }
})

const toolbarActions = [
  { label: 'Bold',        icon: 'B',  command: () => editor.value?.chain().focus().toggleBold().run(),        isActive: () => editor.value?.isActive('bold')        ?? false },
  { label: 'Italic',      icon: 'I',  command: () => editor.value?.chain().focus().toggleItalic().run(),      isActive: () => editor.value?.isActive('italic')      ?? false },
  { label: 'Strike',      icon: 'S',  command: () => editor.value?.chain().focus().toggleStrike().run(),      isActive: () => editor.value?.isActive('strike')      ?? false },
  { label: 'Code',        icon: '<>', command: () => editor.value?.chain().focus().toggleCode().run(),        isActive: () => editor.value?.isActive('code')        ?? false },
  { label: 'Bullet List', icon: '•—', command: () => editor.value?.chain().focus().toggleBulletList().run(),  isActive: () => editor.value?.isActive('bulletList')  ?? false },
  { label: 'Order List',  icon: '1.', command: () => editor.value?.chain().focus().toggleOrderedList().run(), isActive: () => editor.value?.isActive('orderedList') ?? false },
  { label: 'Blockquote',  icon: '❝',  command: () => editor.value?.chain().focus().toggleBlockquote().run(),  isActive: () => editor.value?.isActive('blockquote')  ?? false },
  { label: 'Undo',        icon: '↩',  command: () => editor.value?.chain().focus().undo().run(),              isActive: () => false },
  { label: 'Redo',        icon: '↪',  command: () => editor.value?.chain().focus().redo().run(),              isActive: () => false },
]

function onHeadingChange(e: Event) {
  const level = Number((e.target as HTMLSelectElement).value)
  if (level === 0) {
    editor.value?.chain().focus().setParagraph().run()
  } else {
    editor.value?.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()
  }
}

onBeforeUnmount(() => editor.value?.destroy())
</script>
