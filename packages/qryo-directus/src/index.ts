import { qryoQuery, qryoMutation } from '@akronym/qryo'
import { Directus, ItemsHandler } from '@directus/sdk'
import type { Item, DirectusOptions, TypeMap } from '@directus/sdk'
import { optimisticCreate, optimisticDelete } from './optimistics'
import { unpackData } from './utils'

export class QryoItems<T extends Item> extends ItemsHandler<T> {
  constructor(directus: QryoDirectus, collection: string) {
    super(collection, directus.transport)
  }

  _withQryoQuery(methodName: string, directusQueryArgs: any[]) {
    return {
      qryo: (qryoOptions) => {

        // Set options for tanstack/query and qryo
        const configuredContext = {
          queryKey: [this.collection],
          queryFn: super[methodName],
          queryFnThis: this,
          onReturnQuery: unpackData,
          queryFnArgs: directusQueryArgs,
        }
        return qryoQuery({ ...qryoOptions, ...configuredContext })
      },
    }
  }

  _withQryoMutation(optimistic: null | CallableFunction, methodName: string, directusQueryArgs: any[]) {
    return {
      qryo: (qryoOptions) => {
        // Set options for tanstack/query and qryo
        const configuredContext = {
          queryKey: [this.collection],
          queryFn: super[methodName],
          queryFnThis: this,
          queryFnArgs: directusQueryArgs,
        }

        if (optimistic) {
          // TODO: Filter out keys in `optimisticKeys`
          const optimisticOptions = {
            collection: this.collection,
            key: directusQueryArgs,
            ...qryoOptions,
          }
          const op = optimistic(optimisticOptions)
          console.log('test', op)
          return qryoMutation({ ...op, ...configuredContext })
        }
        return qryoMutation({ ...qryoOptions, ...configuredContext })
      },
    }
  }

  readByQuery(...args: any[]) {
    return this._withQryoQuery('readByQuery', args)
  }

	readOne(...args: any[]) {
    return this._withQryoQuery('readOne', args)
	}

	readMany(...args: any[]) {
    return this._withQryoQuery('readMany', args)
	}

  // TODO: Mutations can also return data and should also use Query
  // if they are called with `createOne({ ..., fields: ['exampleColumn'] })
	createOne(...args: any[]) {
    return this._withQryoMutation(optimisticCreate, 'createOne', args)
	}

	createMany(...args: any[]) {
    return this._withQryoMutation(null, 'createMany', args)
	}

	updateOne(...args: any[]) {
    return this._withQryoMutation(null, 'updateOne', args)
	}

	// updateMany(...args: any[]) {
	// }

	// updateBatch(...args: any[]) {
	// }

	// updateByQuery(...args: any[]) {
	// }

	deleteOne(...args: any[]) {
    return this._withQryoMutation(optimisticDelete, 'deleteOne', args)
	}

	// async deleteMany(...args: any[]) {
	// }
}

export class QryoDirectus extends Directus {
  constructor(url: string, options: DirectusOptions) {
    super(url, options)
  }

  items(collection: string) {
    return new QryoItems(this, collection)
  }
}
