<script setup lang="ts">
import { ref } from 'vue'

const data = ref('')
</script>
<template>
  <div class="flex justify-center items-center h-full">
    <div class="grid grid-cols-3 gap-4 w-128">
      <input
        class="col-span-2 div-1 rounded-lg text-2xl p-2 text-black"
        autofocus
        type="text"
        v-model="data"
      >
      <button class="div-2 border-2 border-white px-8 py-2 text-2xl rounded-lg active:bg-gray-800">Save</button>
      <div class="col-span-3 relative border-2 border-red-400 p-2 text-2xl rounded-lg overflow-hidden">
        {{ data }}
        <div class="absolute bottom-0 right-0 m-1 text-xs text-gray-500">in session memory</div>
      </div>
      <div class="col-span-3 relative border-2 border-green-400 p-2 text-2xl rounded-lg overflow-hidden">
        {{ data }}
        <div class="absolute bottom-0 right-0 m-1 text-xs text-gray-500">in IndexedDB</div>
      </div>
    </div>
  </div>
</template>
