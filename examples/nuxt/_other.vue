
<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
// import { directus } from 'directus'
import { Directus } from '@directus/sdk'
import { resolveNaptr } from 'dns';

// read('haha')

interface Thing {
  id?: number;
  content?: string;
}

const placeholderThings: Thing = { id: 9999, content: 'placeholder' }

// const getItems = async () => await directus.items('thing').readOne(0)
// const data = await getItems()
// const refetch = () => console.log('event')
// const isLoading = false

const directus = new Directus('https://8055-ctholho-offlinefirstcru-bfpofmwby7b.ws-eu92.gitpod.io')
const thing = directus.items('thing')
const fetcherDirectus = async () => {
  return thing.readOne(2)
}
const enabled = ref(false)
const enable = () => {
  enabled.value = true
}

const { isLoading, isError, data, error, refetch } = useQuery({
  queryKey: ['thing', 2],
  queryFn: fetcherDirectus,
  initialData: placeholderThings,
  enabled,
  suspense: true
})

watch(data, () => {
  console.log('dhahahaha', data)
})
</script>

<template>
  <div class="bg-gray-900 flex justify-center items-center h-full">
    <div class="grid grid-cols-4 gap-4 w-128">
      <NuxtLink to="/" class="underline">Home</NuxtLink>
      <div class="col-span-4" :class="isLoading ? 'text-red-500' : ''">isLoading: {{ isLoading }}</div>
      <button @click="enable" class="div-2 border-2 border-white px-8 py-2 text-2xl rounded-lg active:bg-gray-800">Sync</button>
      <input
        v-if="data?.content"
        class="col-span-2 div-1 rounded-lg text-2xl p-2 text-black"
        autofocus
        type="text"
        v-model="data.content"
      >
      <button class="div-2 border-2 border-white px-8 py-2 text-2xl rounded-lg active:bg-gray-800">Save</button>
      <div class="col-span-4 h-14 relative border-2 border-red-400 p-2 text-2xl rounded-lg overflow-hidden">
        {{ data?.content }}
        <div class="absolute bottom-0 right-0 m-1 text-xs text-gray-500">in memory</div>
      </div>
      <div class="col-span-4 h-14 relative border-2 border-green-400 p-2 text-2xl rounded-lg overflow-hidden">
        <!-- {{ data?.[0]?.content }} -->
        <div class="absolute bottom-0 right-0 m-1 text-xs text-gray-500"><s>permanent storage</s></div>
      </div>
      <div class="col-span-2 h-28 relative border-2 border-green-400 p-2 text-xs rounded-lg overflow-y-auto">
        <!-- {{ data?.[0]?.content }} -->
        <div class="absolute bottom-0 right-0 m-1 text-xs text-gray-500"><s>mutation observer</s></div>
      </div>
    </div>
  </div>
</template>
