# Why
Offline-first apps are almost as hard as cryogenics. There are so many decisions a developer has to make. Qryo simplifies things by making most decisions for you.

## Rely on servers but allow offline edits
Qryo helps you build apps that want to connect to a central server somewhere but, you know, the internet is unreliable sometimes, so your users should be able to proceed with their work if they're in the Metro, the Sahara or in a freezing cabinet. Qryo is specifically not for building decentralized, local-first applications.

## State management
Qryo doesn't use a central store – so you're supposed to put your queries directly in components. If you use the same data in multiple components, don't worry, we will deduplicate requests and usually ask the cache first. Now, you might be worried about separation of concerns. Let me just say that you'll likely love that approach once you try it.

## Approach
Qryo relies on [tanstack/query](https://tanstack.com/query/latest) and you can access the tanstack/query API any time you need to be specific about your requests.

Additionally, Qryo encrypts user data on their client with the [WEaR library](https://github.com/erikh2000/web-enc-at-rest).

Now, you tanstack/query makes us write CRUD queries like this. Here we're using the Directus SDK.
```js
const id = 5
const { status, data, error } = useQuery({
  queryKey: ['todos', { id }],
  queryFn: todos.readOne(id),
})
```

This is how you do it with Qryo: 
```js
const { status, data, error } = todos.readOne(5).qryo()
```

Reading data offline is pretty straightforward. You either have the data in a cache somewhere or you don't... but what about updates?

Imagine we want to add a todo while we're offline. It's a simple call:
```js
const { status, data, error } = todos.createOne({ title, dueDate }).qryo()
```
