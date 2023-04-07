# Qryo – brainfreezingly simple offline-first apps

Qryo helps you build offline-first web apps. It concerns itself with server requests like CRUD REST calls or RPCs. For offline static assets use PWAs.

Qryo is **totally not functional yet**. This is a proof of concept and public laboratory.

Stack: Tanstack/query, Nuxt and Directus

## Proposal for offline-first queries for humans™
Qryo helps you turning any query to a Backend-as-a-Service frameworks (BaaS) like Directus into an offline-first query.

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

The idea is to generalize a core module and make a thin wrapper for many of the frontend and BaaS frameworks.

## Why it's possible
Because all CRUD BaaS work more or less the same. (a) There's a server. (b) There's a client. (c) You have items in collections. (d) You can point to those items with an id.

It doesn't matter much if the underlying backend uses relational data or NoSQL because data usually arrives in a very specific form at the client:
`[{ id: 0, title: 'title', content: 'content' }, { id: 1, title: '2nd title', content: '2nd content' }]`

* The response objects have an attribute called `id`, among others
* If it's an array, objects are homogenous

You'll likely want to manipulate single items. Usually, you identify those items with an `id`. Because backend frameworks work in a very predictable way, That means we have a repeatable pattern for updating on the client as well without waiting for a confirmation of the server.

One challenge is to guarantee idempotency in CREATE operations. We need some server-side configuration for that to work. Luckily most databases allow for a way to create columns or attributes with a uniqueness constraint. This `idempotency_key` can be abstracted away your normal client request if it follows the same rules everywhere – which is a sensible idea in any case.

## Playing around

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ctholho/qryo)

This starts a Nuxt example, Directus Instance and Vitepress for the docs.
Making changes to `packages/qryo` will trigger a build and should be reflected in the Nuxt example.

See which JS scripts are running with `pnpm exec pm2 ps`. Get the build logs for the packages by running `pnpm exec pm2 logs packages` or run `make logs`.

Run `make help` for all available makefile commands.

You can also run the repo locally. There's no https support yet and you'll have to look into .gitpod.yml to see the env requirements.

## Roadmap
0. Make everything work
1. Handle authentication and offer tools for offline authentication (if offline data is available)
2. Encrypt user data
  * Consider putting encryption logic into web worker for client performance
  * The query persister needs to have access to app context like user credentials.
3. Find the best way to prefetch "all necessary" data on app initialization. E.g.:
  * Require devs to handle it themselves
  * Offer global config. But this still requires duplicated naming of the endpoints (in component and in config)
  * Parse codebase during build process and create prefetch functions if those queries look correct. E.g.:
    ```
    // Prefetch the first two pages on application start, even if the current page is not yet defined.
    // Just to show, that you can pass more attributes in the prefetch, we're sorting (only) the prefetch by date, descending.
    const currentPage = undefined
    { data } = directus.items('todos').readByQuery({ page: currentPage }).qryo({
      prefetch$: {
        page: [1, 2] 
        sort: ['-date']
      }
    })
    ```
    `prefetch$` expects an object which is simply merged with the object that directus `readByQuery()` function expects.
4. 
