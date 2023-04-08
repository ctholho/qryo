import { Directus } from '@directus/sdk';

class ExtendedDirectus extends Directus {
  items(collection) {
    this.collection = collection;
    return this;
  }

  readByQuery(queryOptions) {
    this.action = 'readByQuery';
    this.queryOptions = queryOptions;
    return this;
  }

  qryo(additionalOptions) {
    const { placeholderData, enabled } = additionalOptions;
    const key = [this.queryOptions];
    return qryo(this.action, this.collection, key, { placeholderData, enabled });
  }
}

const directusInstance = new ExtendedDirectus('http://localhost:8055'); // Replace with your Directus endpoint

// Usage example:
const { data } = directusInstance.items('todos').readByQuery({ limit: -1 }).qryo({ placeholderData, enabled });
