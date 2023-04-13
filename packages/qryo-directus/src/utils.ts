import type { QueryContext } from '@akronym/qryo'

export function unpackData(context: QueryContext) {
  return ['readByQuery', 'readMany'].includes(context.queryFn?.name)
    ? context.result.data
    : context.result
}
