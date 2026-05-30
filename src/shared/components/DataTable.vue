<template>
  <div class="w-full">
    <!-- Search slot -->
    <slot name="toolbar" />

    <div
        class="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-sm"
    >
      <table class="w-full border-collapse">

        <!-- HEADER -->
        <thead class="bg-base-200/80">
        <tr>

          <th
              v-for="col in columns"
              :key="String(col.key)"
              :style="col.width ? { width: col.width } : {}"
              :class="[
            'px-4 py-3 text-left text-sm font-semibold text-base-content border-b border-base-300',
            col.sortable
              ? 'cursor-pointer select-none hover:bg-base-300 transition-colors'
              : ''
          ]"
              @click="col.sortable ? $emit('sort', String(col.key)) : undefined"
          >

            <div class="flex items-center gap-1">

              {{ col.header }}

              <template v-if="col.sortable">

                <ChevronUpDownIcon
                    v-if="sort !== String(col.key)"
                    class="h-4 w-4 opacity-40"
                />

                <ChevronUpIcon
                    v-else-if="direction === 'asc'"
                    class="h-4 w-4"
                />

                <ChevronDownIcon
                    v-else
                    class="h-4 w-4"
                />

              </template>

            </div>

          </th>

          <th
              v-if="$slots.actions"
              class="w-24 px-4 py-3 text-left text-sm font-semibold text-base-content border-b border-base-300"
          >
            Actions
          </th>

        </tr>
        </thead>

        <!-- BODY -->
        <tbody>

        <!-- LOADING -->
        <template v-if="loading">

          <tr
              v-for="i in skeletonRows"
              :key="`sk-${i}`"
              class="odd:bg-base-200/40 even:bg-base-100"
          >

            <td
                v-for="col in columns"
                :key="`sk-${i}-${String(col.key)}`"
                class="px-4 py-3 border-b border-base-200"
            >

              <div
                  class="skeleton-shimmer h-4 rounded"
                  :style="{ width: `${60 + Math.random() * 30}%` }"
              />

            </td>

            <td
                v-if="$slots.actions"
                class="px-4 py-3 border-b border-base-200"
            >
              <div class="skeleton-shimmer h-4 w-16 rounded" />
            </td>

          </tr>

        </template>

        <!-- EMPTY -->
        <tr v-else-if="!data.length">

          <td
              :colspan="columns.length + ($slots.actions ? 1 : 0)"
              class="py-0"
          >

            <EmptyState
                :title="emptyTitle"
                :description="emptyDescription"
            />

          </td>

        </tr>

        <!-- DATA -->
        <template v-else>

          <tr
              v-for="(row, idx) in data"
              :key="idx"
              class="
            odd:bg-base-200/30
            even:bg-base-100
            hover:bg-base-200/70
            transition-colors
          "
              :class="rowClass ? rowClass(row) : ''"
              @click="$emit('row-click', row)"
          >

            <td
                v-for="col in columns"
                :key="String(col.key)"
                class="px-4 py-3 text-sm text-base-content border-b border-base-200"
            >

              <slot
                  :name="`cell-${String(col.key)}`"
                  :row="row"
                  :value="getCellValue(row, col)"
              >

              <span>
                {{
                  col.formatter
                      ? col.formatter(getCellValue(row, col), row)
                      : getCellValue(row, col)
                }}
              </span>

              </slot>

            </td>

            <td
                v-if="$slots.actions"
                class="px-4 py-3 border-b border-base-200"
            >

              <slot
                  name="actions"
                  :row="row"
              />

            </td>

          </tr>

        </template>

        </tbody>

      </table>
    </div>


    <!-- Pagination -->
    <Pagination
      v-if="totalPages > 0"
      :page="page"
      :total-pages="totalPages"
      :total="total"
      :size="size"
      @change="$emit('page-change', $event)"
    />
  </div>
</template>

```vue id="8d1mzp"
<script setup lang="ts" generic="T extends Record<string, unknown>">
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'

import Pagination from './Pagination.vue'
import EmptyState from './EmptyState.vue'

import type { TableColumn } from '@/shared/types/shared.types'

const props = withDefaults(
    defineProps<{
      columns: TableColumn<T>[]
      data: T[]
      loading?: boolean
      total?: number
      totalPages?: number
      page?: number
      size?: number
      sort?: string
      direction?: 'asc' | 'desc'
      skeletonRows?: number
      emptyTitle?: string
      emptyDescription?: string
      rowClass?: (row: T) => string
    }>(),
    {
      loading: false,
      skeletonRows: 5,
      emptyTitle: 'No records found',
      emptyDescription: '',
      total: 0,
      totalPages: 0,
      page: 1,
      size: 20,
      sort: '',
      direction: 'desc',
    }
)

const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'sort', column: string): void
  (e: 'row-click', row: T): void
}>()

function getCellValue(
    row: T,
    col: TableColumn<T>
): unknown {

  const key = String(col.key)

  return key
      .split('.')
      .reduce((obj: unknown, part) => {

        if (obj && typeof obj === 'object') {
          return (obj as Record<string, unknown>)[part]
        }

        return undefined

      }, row)

}
</script>
```

