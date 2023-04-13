export function optimisticCreate(options) {
  const { collection, key } = options

  if (!options.queryClient) {
    return { ...options }
  }

  return {
    onMutate: async (createData) => {
      const queryClient = options.queryClient

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
      const queryClient = options.queryClient
      queryClient.setQueryData([ collection, ...key ], context!.previousTodos)
    },
    // Always refetch after error or success:
    onSettled: () => {
      const queryClient = options.queryClient
      queryClient.invalidateQueries({ queryKey: [ collection, ...key ] })
    },
    ...options
  }
}

export function optimisticDelete(options) {
  const { collection, key } = options

  if (!options.queryClient) {
    return { ...options }
  }

  return {
    // TODO: identify mutations with mutation key and also delete from mutation queue
    onMutate: async (itemId) => {
      const queryClient = options.queryClient

      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: [ collection, ...key ] })

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData([ collection, ...key ])

      // Optimistically update to the new value
      queryClient.setQueryData([ collection, ...key ], (old: any) => {
        return old.filter(obj => obj.id !== itemId)
      })

      // Return a context object with the snapshotted value
      return { previousTodos }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      const queryClient = options.queryClient
      queryClient.setQueryData([ collection, ...key ], context!.previousTodos)
    },
    // Always refetch after error or success:
    onSettled: () => {
      const queryClient = options.queryClient
      queryClient.invalidateQueries({ queryKey: [ collection, ...key ] })
    },
    ... options
  }
}
