<script setup lang="ts">
import { onlineManager, useQueryClient } from '@tanstack/vue-query'
import { QryoDirectus } from '@akronym/qryo-directus'

const config = useRuntimeConfig()
const directus = new QryoDirectus(config.public.apiUrl)
const queryClient = useQueryClient()

const enabled = ref(true)
const placeholderData = [{ id: 9999, content: 'placeholder' }]
const { data: todos, refetch } = directus
  .items('thing')
  .readByQuery({ limit: -1 })
  .qryo({ placeholderData, enabled })

// TODO: get queryClient in QryoMutation without explicit passing
const { mutate: createTodo } = directus.items('thing').createOne().qryo({ queryClient })

// This doesn't show optimistic updates
const { mutate: deleteTodo } = directus.items('thing').deleteOne().qryo({ queryClient })

const newTodo = ref('')
const saveInput = () => {
  createTodo({ content: newTodo.value })
  newTodo.value = ''
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
        <div class="flex-1" />
        <NuxtLink to="/" class="self-center whitespace-nowrap">To Index</NuxtLink>
      </div>
      <button @click="refetch" class="div-2 py-2 border-2 border-white text-xl rounded-lg active:bg-gray-800">Refetch</button>
      <input
        class="col-span-2 div-1 rounded-lg text-xl px-2 text-black"
        autofocus
        type="text"
        v-model="newTodo"
      >
      <button @click="saveInput" class="div-2 border-2 border-white text-xl rounded-lg active:bg-gray-800">Create</button>
      <template v-if="todos">
        <div v-for="todo in todos" :key="todo.id" class="col-span-4 h-12 relative border-2 border-red-400 p-2 text-xl rounded-lg overflow-hidden">
          {{ todo?.content }}
          <button class="absolute bottom-0 right-0 m-1 text-xs text-gray-500" @click="deleteTodo(todo.id)">delete</button>
        </div>
      </template>
      <!-- placeholderData prevents ever seeing this: -->
      <div v-else class="col-span-4 h-12 relative border-2 border-gray-400 p-2 text-xl rounded-lg overflow-hidden">
        <span class="animate-pulse ">
          ... loading
        </span>
      </div>
    </div>
  </div>
</template>
