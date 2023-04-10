import { useQuery, useMutation } from '@tanstack/vue-query'
import { unpackData } from './utils'

interface QueryContext {
  queryKey: string[]
  queryFn: any
  context: any
  args: any
}

export function qryoQuery(queryContext: QueryContext, queryOptions: any = {}) {
  const { queryKey, queryFn, context, args } = queryContext
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const run = await queryFn.apply(context, args)
      return unpackData(queryFn.name) ? run.data : run
    },
    ...queryOptions,
  })
}

export function qryoMutation(queryContext: QueryContext, queryOptions: any = {}) {
  const { queryFn, context, args: queryContextArgs } = queryContext
  return useMutation({
    mutationFn: async (args) => {
      if (queryContextArgs.length > 0) {
        return queryFn.apply(context, [...queryContextArgs, args])
      }
      else {
        return queryFn.call(context, args)
      }
    },
    ...queryOptions,
  })
}