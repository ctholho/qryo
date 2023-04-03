import type { DehydratedState, VueQueryPluginOptions } from "@tanstack/vue-query";
import { VueQueryPlugin, QueryClient, hydrate, dehydrate } from "@tanstack/vue-query";
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { QryoPlugin } from '@akronym/qryo'
import { get, set, del } from "idb-keyval";
import { PersistedClient, Persister } from "@tanstack/query-persist-client-core";
import { open, encryptObject } from 'web-enc-at-rest'


export default defineNuxtPlugin((nuxt) => {
  // create web-enc-at-rest context, aka logging in
  // const wearContext = open('admin', 'admin')

  // Nuxt3 specific way to load runtime env vars
  const config = useRuntimeConfig();
  const qryoOptions = { url: config.public.apiUrl, wearContext: 'ha' }

  const vueQueryState = useState<DehydratedState | null>("vue-query");

  // Modify your Vue Query global settings here
  const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
          cacheTime: 1000 * 60 * 60 * 24,
          staleTime: 1000 * 60 * 60 * 24,
        },
      },
  })

  /**
   * Creates an Indexed DB persister
   * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
   */
  function createIDBPersister(idbValidKey: IDBValidKey) {
    return {
      persistClient: async (client: PersistedClient) => {
        set(idbValidKey, client)
      },
      restoreClient: async () => {
        return await get<PersistedClient>(idbValidKey);
      },
      removeClient: async () => {
        await del(idbValidKey);
      },
    } as Persister;
  }

  const clientPersister = (queryClient: QueryClient) => {
    return persistQueryClient({
      queryClient,
      persister: createIDBPersister('qryo')
    })
  }

  const options: VueQueryPluginOptions = { queryClient, clientPersister }

  nuxt.vueApp.use(QryoPlugin, qryoOptions)
  nuxt.vueApp.use(VueQueryPlugin, options)

  if (process.server) {
    nuxt.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (process.client) {
    nuxt.hooks.hook("app:created", () => {
      hydrate(queryClient, vueQueryState.value);
    });
  }
})
