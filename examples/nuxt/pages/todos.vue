<script setup lang="ts">
import { qryo } from '@akronym/qryo'
import { onlineManager } from '@tanstack/vue-query'

interface Thing {
  id: number;
  content: string;
}

const enabled = ref(true)
const placeholderData: Thing[] = [{ id: 9999, content: 'placeholder' }]
const { data: todos, refetch } = qryo('readByQuery', 'thing', { limit: -1 }, { placeholderData, enabled })

const { mutate: create } = qryo('createOne', 'thing')
const { mutate: deleteTodo } = qryo('deleteOne', 'thing')

const newTodo = ref('')
const saveInput = () => {
  create({ content: newTodo.value })
  newTodo.value = ''
}

const online = ref(true)
watchEffect(() => {
  onlineManager.setOnline(online.value)
})
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <div class="grid grid-cols-4 gap-4 w-128">
      <div class="col-span-4 flex space-x-4">
        <button class="border-white border-2 px-4 py-1 rounded-lg" :class="!online && 'line-through'" @click="() => { online = !online}">online</button>
        <button class="border-white border-2 px-4 py-1 rounded-lg" :class="!enabled && 'line-through'" @click="() => { enabled = !enabled}">enable</button>
        <NuxtLink to="/" class="self-center">Go to index</NuxtLink>
      </div>
      <button @click="refetch" class="div-2 border-2 border-white px-8 py-2 text-2xl rounded-lg active:bg-gray-800">Sync</button>
      <input
        class="col-span-2 div-1 rounded-lg text-2xl p-2 text-black"
        autofocus
        type="text"
        v-model="newTodo"
      >
      <button @click="saveInput" class="div-2 border-2 border-white px-8 py-2 text-2xl rounded-lg active:bg-gray-800">Create</button>
      <template v-if="todos?.data">
        <div v-for="todo in todos.data" :key="todo.id" class="col-span-4 h-14 relative border-2 border-red-400 p-2 text-2xl rounded-lg overflow-hidden">
          {{ todo?.content }}
          <button class="absolute bottom-0 right-0 m-1 text-xs text-gray-500" @click="deleteTodo(todo.id)">delete</button>
        </div>
      </template>
    </div>
  </div>
</template>
