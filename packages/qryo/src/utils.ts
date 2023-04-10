// TODO: move to qryo-directus
export function unpackData(fnName: string) {
  return ['readByQuery', 'readMany'].includes(fnName)
}