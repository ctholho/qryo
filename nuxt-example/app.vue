<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

interface Thing {
  id?: number;
  content?: string;
}

const initialThings: Thing[] = [
  { id: 9999, content: 'inital' },
]
const placeholderThings: Thing[] = [
  { id: 9999, content: 'placeholder' },
]

const { getItems } = useDirectusItems()

const getThings = async () => await getItems<Thing[]>({
  collection: 'thing'
})

const { isLoading, isError, data, error, refetch } = useQuery({
  queryKey: ['things'],
  queryFn: getThings,
  initialData: initialThings,
  placeholderData: placeholderThings,
})

</script>

<template>
  <div class="flex justify-center items-center h-full">
    <div class="grid grid-cols-4 gap-4 w-128">
      <div class="col-span-4">isLoading: {{ isLoading }}</div>
      <button @click="refetch()" class="div-2 border-2 border-white px-8 py-2 text-2xl rounded-lg active:bg-gray-800">Sync</button>
      <input
        v-if="data?.[0]?.content"
        class="col-span-2 div-1 rounded-lg text-2xl p-2 text-black"
        autofocus
        type="text"
        v-model="data[0].content"
      >
      <button class="div-2 border-2 border-white px-8 py-2 text-2xl rounded-lg active:bg-gray-800">Save</button>
      <div class="col-span-4 h-14 relative border-2 border-red-400 p-2 text-2xl rounded-lg overflow-hidden">
        {{ data?.[0]?.content }}
        <div class="absolute bottom-0 right-0 m-1 text-xs text-gray-500">in session memory</div>
      </div>
      <div class="col-span-4 h-14 relative border-2 border-green-400 p-2 text-2xl rounded-lg overflow-hidden">
        <!-- {{ data?.[0]?.content }} -->
        <div class="absolute bottom-0 right-0 m-1 text-xs text-gray-500"><s>in IndexedDB</s></div>
      </div>
    </div>
  </div>
</template>
