import { qryoQuery, qryoMutation } from '@akronym/qryo'
import { Directus, ItemsHandler } from '@directus/sdk'
import { optimisticCreate } from './optimistics'

export const QryoDirectusPlugin = {
  async install(app, options) {
    // TODO: CURRENTLY DISABLED
    // const directusInstance = new QryoDirectus(options.url)
    // app.provide('directus', directusInstance)
  }
}

export class QryoItems extends ItemsHandler {
  constructor(directus, collection) {
    super(collection, directus.transport)
  }

  _withQryoQuery(methodName, ...args) {
    return {
      qryo: (queryOptions) => {
        const queryContext = {
          queryKey: [this.collection, ...args],
          queryFn: super[methodName],
          context: this,
          args,
        }
        return qryoQuery(queryContext, queryOptions)
      },
    }
  }

  _withQryoMutation(optimistic, methodName, ...args) {
    return {
      qryo: (queryOptions) => {
        const queryContext = {
          queryKey: [this.collection, ...args],
          queryFn: super[methodName],
          context: this,
          args,
        }
        if (optimistic) {
          // TODO: Filter out keys in `optimisticKeys`
          return qryoMutation(queryContext, optimistic({ collection: this.collection, key: args, queryOptions }))
        }
        return qryoMutation(queryContext, queryOptions)
      },
    }
  }

  readByQuery(...args) {
    return this._withQryoQuery('readByQuery', ...args)
  }

	readOne(...args) {
    return this._withQryoQuery('readOne', ...args)
	}

	readMany(...args) {
    return this._withQryoQuery('readMany', ...args)
	}

  // TODO: Mutations can also return data and should also use Query
  // if they are called with `createOne({ ..., fields: ['exampleColumn'] })
	createOne(...args) {
    return this._withQryoMutation(optimisticCreate, 'createOne', ...args)
	}

	createMany(...args) {
    return this._withQryoMutation(undefined, 'createMany', ...args)
	}

	updateOne(...args) {
    return this._withQryoMutation(undefined, 'updateOne', ...args)
	}

	// updateMany(...args) {
	// }

	// updateBatch(...args) {
	// }

	// updateByQuery(...args) {
	// }

	deleteOne(...args) {
    return this._withQryoMutation(undefined, 'deleteOne', ...args)
	}

	// async deleteMany(...args) {
	// }
}

export class QryoDirectus extends Directus {
  constructor(url: string, options = {}) {
    super(url, options)
  }

  items(collection: string) {
    return new QryoItems(this, collection)
  }
}
