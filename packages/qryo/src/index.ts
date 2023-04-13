import { useQuery, useMutation } from '@tanstack/vue-query'

export interface QueryContext {
  queryKey: string[]
  queryFn: any
  queryFnThis: any
  queryFnArgs: any
  onReturnQuery?: (context: QueryContext) => unknown
  result?: any
}

export function qryoQuery(queryContext: QueryContext) {
  const { queryKey, queryFn, queryFnThis, queryFnArgs, onReturnQuery, ...rest } = queryContext
  return useQuery({
    queryKey,
    queryFn: async () => {
      const result = await queryFn.apply(queryFnThis, queryFnArgs)

      if (onReturnQuery) {
        queryContext.result = result
        return onReturnQuery(queryContext)
      }
      return result
    },
    ...rest,
  })
}

export function qryoMutation(queryContext: QueryContext) {
  const { queryFn, queryFnThis, queryFnArgs, ...rest } = queryContext
  return useMutation({
    mutationFn: async (mutationFnArgs) => {
      if (queryFnArgs.length > 0) {
        return queryFn.apply(queryFnThis, [...queryFnArgs, mutationFnArgs])
      }
      else {
        return queryFn.call(queryFnThis, mutationFnArgs)
      }
    },
    ...rest,
  })
}
