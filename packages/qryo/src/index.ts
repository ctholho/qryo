import { inject } from 'vue'
import { Directus } from '@directus/sdk'
import type { IDirectus, IItems } from '@directus/sdk'
import { useQuery, useMutation } from '@tanstack/vue-query'


export const QryoPlugin = {
  install(app: any, options: any) {
    const directusInstance = new Directus(options.url)
    app.provide('directus', directusInstance)
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
