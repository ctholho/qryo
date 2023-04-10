export function optimisticCreate(queryOptions) {
  const { queryClient, collection, key } = queryOptions

  if (!queryClient) {
    return { ...queryOptions }
  }

  return {
    onMutate: async (createData) => {
      const queryClient = queryOptions.queryClient

      // TODO: get this from mutation context
      const createDataWithId = { id: Date.now(), ...createData }

      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: [ collection, ...key ] })

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData([ collection, ...key ])

      // Optimistically update to the new value
      queryClient.setQueryData([ collection, ...key ], (old: any) => {
        return [...old, createDataWithId]
      })

      // Return a context object with the snapshotted value
      return { previousTodos }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      const queryClient = queryOptions.queryClient
      queryClient.setQueryData([ collection, ...key ], context!.previousTodos)
    },
    // Always refetch after error or success:
    onSettled: () => {
      const queryClient = queryOptions.queryClient
      queryClient.invalidateQueries({ queryKey: [ collection, ...key ] })
    },
    ...queryOptions
  }
}
