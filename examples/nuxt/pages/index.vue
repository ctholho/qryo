<script setup lang="ts">
import { get, clear } from "idb-keyval";
import { onlineManager } from '@tanstack/vue-query'
import { QryoDirectus } from '@akronym/qryo-directus'

const config = useRuntimeConfig()
const directus = new QryoDirectus(config.public.apiUrl)

const enabled = ref(false)
const placeholderData = { id: 9999, content: 'placeholder' }
const { data, refetch } = directus
  .items('thing')
  .readOne(1)
  .qryo({ placeholderData, enabled })

const { mutate } = directus.items('thing').updateOne(1).qryo()

const getMutations = async () => (await get('qryo'))?.clientState.mutations
const mutations = ref(await getMutations())
const updateMutations = async () => {
  mutations.value = await getMutations()
}

const getPermStorage = async () => {
  const stored = await get('qryo')
  const query = stored?.clientState?.queries?.find((q: any) => q.queryHash = "[\"thing\",1]")
  return query?.state.data.content
}
const permStorage = ref(await getPermStorage())
const updatePermStorage = async  () => {
  permStorage.value = await getPermStorage()
}

const inputContent = ref('')
const updateInput = (value: string) => {
  inputContent.value = value;
}

const saveInput = () => {
  mutate({ content: inputContent.value })
}

const online = ref(true)
watchEffect(() => {
  onlineManager.setOnline(online.value)
})
</script>

<template>
  <div class="flex justify-center mt-4">
    <div class="grid grid-cols-4 gap-4 max-w-md">
      <div class="col-span-4 flex space-x-4">
        <button class="border-white border-2 px-4 py-1 rounded-lg" :class="!online && 'line-through'" @click="() => { online = !online}">online</button>
        <button class="border-white border-2 px-4 py-1 rounded-lg" :class="!enabled && 'line-through'" @click="() => { enabled = !enabled}">enable</button>
        <button class="border-white border-2 px-4 py-1 rounded-lg whitespace-nowrap"  @click="clear()">empty cache</button>
        <div class="flex-1" />
        <NuxtLink to="/todos" class="self-center whitespace-nowrap">To Todos</NuxtLink>
      </div>
      <button @click="refetch" class="div-2 border-2 border-white py-2 text-xl rounded-lg active:bg-gray-800">Refetch</button>
      <input
        v-if="data?.content"
        class="col-span-2 div-1 rounded-lg text-2xl px-2 text-black"
        autofocus
        type="text"
        :value="data.content"
        @input="updateInput($event.target.value)"
      >
      <button @click="saveInput" class="div-2 border-2 border-white py-2 text-xl rounded-lg active:bg-gray-800">Save</button>
      <div class="col-span-4 h-12 relative border-2 border-red-400 p-2 text-xl rounded-lg overflow-hidden">
        {{ data?.content }}
        <div class="absolute bottom-0 right-0 m-1 text-xs text-gray-500">memory</div>
      </div>
      <div class="col-span-4 h-12 relative border-2 border-green-400 p-2 text-xl rounded-lg overflow-y-scroll">
        {{ permStorage }}
        <ButtonRefresh @click="updatePermStorage" />
        <div class="absolute bottom-0 right-0 m-1 text-xs text-gray-500">cache</div>
      </div>
      <div class="col-span-4 h-28 relative border-2 border-green-400 p-2 text-xs rounded-lg overflow-y-auto">
        <p v-for="mutation in mutations">{{ mutation.state.variables }}</p>
        <div class="absolute bottom-0 right-0 m-1 text-xs text-gray-500">mutations in storage</div>
        <ButtonRefresh @click="updateMutations" />
      </div>
    </div>
  </div>
</template>
