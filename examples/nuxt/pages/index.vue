<script setup lang="ts">
import { get } from "idb-keyval";
import { qryo } from '@akronym/qryo'
import { useQueryClient } from '@tanstack/vue-query'

const queryClient = useQueryClient()
const cache = queryClient.getQueryCache()
console.log('dhahahaha', cache)

interface Thing {
  id: number;
  content: string;
}

const placeholderData: Thing = { id: 9999, content: 'placeholder' }
const enabled = ref(true)

const updateData = { content: 'from server' }

const { data, refetch } = qryo('readOne', 'thing', 1, { placeholderData, enabled })
const { mutate } = qryo('updateOne', 'thing', 1, { updateData } )

const getData = () => {
  enabled.value = true
  refetch()
}

const permStorage = ref((await get('qryo'))?.clientState?.queries?.[0]?.state?.data.content)
const updatePermStorage = async  () => { permStorage.value = (await get('qryo'))?.clientState?.queries?.[0]?.state?.data.content }

const content = ref('')
function updateInput(value: string) {
  content.value = value;
}

watch(content, () => {
  console.log('content', content)
})
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <div class="grid grid-cols-4 gap-4 w-128">
      <NuxtLink to="/other" class="underline">Other</NuxtLink>
      <!-- <div class="col-span-4" :class="isLoading ? 'text-red-500' : ''">isLoading: {{ isLoading }}</div> -->
      <div class="col-span-4">...</div>
      <button @click="getData" class="div-2 border-2 border-white px-8 py-2 text-2xl rounded-lg active:bg-gray-800">Sync</button>
      <input
        v-if="data?.content"
        class="col-span-2 div-1 rounded-lg text-2xl p-2 text-black"
        autofocus
        type="text"
        :value="data.content"
        @input="updateInput($event.target.value)"
      >
      <button @click="mutate({ content })" class="div-2 border-2 border-white px-8 py-2 text-2xl rounded-lg active:bg-gray-800">Save</button>
      <div class="col-span-4 h-14 relative border-2 border-red-400 p-2 text-2xl rounded-lg overflow-hidden">
        {{ data?.content }}
        <div class="absolute bottom-0 right-0 m-1 text-xs text-gray-500">in memory</div>
      </div>
      <div class="col-span-4 h-14 relative border-2 border-green-400 p-2 text-2xl rounded-lg overflow-y-scroll">
        {{ permStorage }}
        <button @click="updatePermStorage" class="h-4 w-4 bg-emerald-500 text-black text-xs"><carbon-arrow-down />sync</button>
        <div class="absolute bottom-0 right-0 m-1 text-xs text-gray-500">permanent storage</div>
      </div>
      <div class="col-span-2 h-28 relative border-2 border-green-400 p-2 text-xs rounded-lg overflow-y-auto">
        <!-- {{ queryClient }} -->
        <div class="absolute bottom-0 right-0 m-1 text-xs text-gray-500"><s>mutation observer</s></div>
      </div>
    </div>
  </div>
</template>
