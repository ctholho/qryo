# Qryo – brainfreezingly simple offline-first apps

Qryo helps you build offline-first web apps. It concerns itself with server requests like
CRUD REST calls or RPCs. For offline static assets use PWAs.

Qryo is **totally not functional yet**. This is a proof of concept and public laboratory.

Stack: Tanstack/query, Nuxt and Directus

## Proposal for offline-first queries for humans™
Qryo helps you turning any query to a Backend-as-a-Service frameworks (BaaS) like Directus
into an offline-first query.

Normally you call the Directus SDK like this:

```
const data = await directus.items('todo').createOne({ content: 'new todo' })
```

Exposing an API akin to tanstack/query, it'll become
```
const { mutate } = directus.items('todo').createOne().qryo()
await mutate({ content: 'new todo' })
```

Given a few requisites, this would:
* persist the mutation in IndexedDB
* and encrypt that
* show an optimistic update
* make the POST request idempotent

The idea is to generalize a core module and make a thin wrapper for many of the frontend
and BaaS frameworks.

## Why it's possible
Because all CRUD BaaS work more or less the same. (a) There's a server. (b) There's a
client. (c) You have items in collections. (d) You can point to those items with an id.

It doesn't matter much if the underlying backend uses relational data or NoSQL because
data usually arrives in a very specific form at the client:
```
[
  { id: 0, title: 'title', content: 'content' },
  { id: 1, title: '2nd title', content: '2nd content' }
]
```

* The response objects have an attribute called `id`, among others
* If it's an array, objects are homogenous

You'll likely want to manipulate single items. Usually, you identify those items with an
`id`. Because backend frameworks work in a very predictable way in order to generalize
logic on the backend, we can rely on those patterns to build libraries that for optimistic
updates and encrypted storage of queries and mutation queus.

## Idempotency
One minor challenge is to guarantee idempotency for POST requests (e.g. for an RPC).
In the case of BaaS, this can be handled easily because databases allow columns with a
uniqueness constraint and adding a column à la `idempotency_key`. Users of Django, Rails
or Laravel or Directus might choose to handle this differently without polluting their
datamodel e.g. by using middleware together with Redis.

On the frontend idempotency comes down to sending a unique key. Qryo allows users to set
a sensible default which they can always overwrite per mutation.
```
// use a custom hash
const { mutate } = directus
  .items('payment')
  .createOne()
  .qryo({ idempotency: req => hashPayment(req) })

await mutate({ receiver, amount, timestamp })
```

For simple usecases `idempotency_key` can be a simple timestamp + random number and
totally disappear for front-end devs (akin to how the Directus SDK handles user
authorization and refresh tokens).

## Playing around
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ctholho/qryo)

Opening the Gitpod Link starts a Nuxt example, Directus Instance and Vitepress for the
docs. Making changes to `packages/qryo` will trigger a build and should be reflected in
the Nuxt example.

See which scripts are running with `pnpm exec pm2 ps`. Get the build logs for the
packages by running `pnpm exec pm2 logs packages` or run `make logs`.

Run `make help` for all available makefile commands.

You can also run the repo locally. You need Docker, Node, pnpm and GNU Make. Go to the
project root and run `make init-local`.

## Challenges and potential dealbrakers
**How to handle dynamic filters?**
Dynamically setting filters that query a long list of objects is easy online-only...
you simply refetch if your filter changes because the logic is on the backend.
For offline-first you have to implement that logic yourself.
* Allow Devs to ignore it when sensible and fall back to online-only
* We could offer tools to build it if necessary – powerful but hard to get DX right
  * E.g. provide easy bindings for [alaSQL](http://alasql.org)?
  * Or: this is [an interesting approach](https://stackoverflow.com/a/20404324/8130552)
* Offline functionality might be degraded anyways, so it's OK to offer less capable
  offline filters.

## Roadmap
1. Find a reliable way for applying mutations on offline-only items
  * The problem is that an optimistic update doesn't have the real id. So mutations on
    that object must be translated to the real id, once that id is available.
  * While offline: creating and then deleting an item will cause the item to be posted
  * There should be an easy way to display when an item is not yet synced. E.g. mixing in
    an attribute `_offline: true`.
2. Handle authentication and offer tools for offline authentication (if offline data is
  available)
3. Encrypt user data
  * Consider putting encryption logic into web worker for client performance
  * The query persister needs to have access to app context like user credentials.
4. Find the best way to prefetch "all necessary" data on app initialization. E.g.:
  * Require devs to handle it themselves
  * Offer global config. But this still requires duplicated naming of the endpoints (in
    component and in config)
  * Parse codebase during build process and create prefetch functions if those queries
    look correct. E.g.:
    ```
    // Prefetch the first two pages on application start,
    // even if the current page is not yet defined.
    // Just to show, that you should be able to pass more
    // attributes in the prefetch as we're sorting (only)
    // the prefetch by date, descending.
    const currentPage = undefined
    { data } = directus.items('todos').readByQuery({ page: currentPage }).qryo({
      prefetch: {
        page: [1, 2] 
        sort: ['-date']
      }
    })
    ```
    `prefetch` expects an object which is simply merged with the object that directus'
    `readByQuery()` function expects.
5. 