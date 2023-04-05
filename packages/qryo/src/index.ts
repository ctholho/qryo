import { inject } from 'vue'
import { Directus } from '@directus/sdk'
import type { IDirectus, IItems } from '@directus/sdk'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { open } from '@akronym/web-enc-at-rest'

export const QryoPlugin = {
  async install(app: any, options: any) {
    const directusInstance = new Directus(options.url)
    app.provide('directus', directusInstance)
    const context = await open('admin', 'admin')
    app.provide('wear', context)
  }
}

export const qryo = (action: keyof IItems<any>, collection: string, key: any, queryOptions: any = {}) => {
  const directus = inject('directus') as IDirectus<any>
  if (directus) {
    if (action.startsWith('update')) {
      return useMutation({
        mutationFn: async (updateData) => {
          // @ts-ignore
          return directus.items(collection)[action](key, updateData)
        },
        ... queryOptions
      })
    }
    else if (action.startsWith('create')) {
      return useMutation({
        mutationFn: async (createData) => {
          // @ts-ignore
          return directus.items(collection)[action](createData)
        },
        onMutate: async (createData) => {

          const queryClient = queryOptions.queryClient

          // Cancel any outgoing refetches
          // (so they don't overwrite our optimistic update)
          await queryClient.cancelQueries({ queryKey: ['thing', { limit: -1 }] })

          // Snapshot the previous value
          const previousTodos = queryClient.getQueryData(['thing', { limit: -1 }])

          // Optimistically update to the new value
          queryClient.setQueryData(['thing', { limit: -1 }], (old: any) => [...old.data, createData])

          // Return a context object with the snapshotted value
          return { previousTodos }
        },
        // If the mutation fails,
        // use the context returned from onMutate to roll back
        onError: (err, newTodo, context) => {
          const queryClient = queryOptions.queryClient
          queryClient.setQueryData(['thing', { limit: -1 }], context!.previousTodos)
        },
        // Always refetch after error or success:
        onSettled: () => {
          const queryClient = queryOptions.queryClient
          // queryClient.invalidateQueries({ queryKey: ['thing', { limit: -1 }] })
        },
        ... queryOptions
      })
    }
    else if (action.startsWith('delete')) {
      return useMutation({
        mutationFn: async (key: any) => {
          // @ts-ignore
          return directus.items(collection)[action](key)
        },
        ... queryOptions
      })
    }
    else { // if (action.startsWith('read')) {
      return useQuery({
        queryKey: [collection, key],
        // @ts-ignore
        queryFn: async () => directus.items(collection)[action](key),
        ... queryOptions
      })
    }
  }
  else {
    console.error('Can not connect to undefined Directus Instance')
    return { error: 'No Directus Instance found', isError: true }
  }
}
