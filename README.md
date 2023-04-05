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

It doesn't matter much if they use relational data or NoSQL because data usually arrives in a very specific way at the client.

## Playing around

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ctholho/qryo)

This starts a Nuxt example, Directus Instance and Vitepress for the docs.
Making changes to `packages/qryo` will trigger a build and should be reflected in the Nuxt example.

See which JS scripts are running with `pnpm exec pm2 ps`. Get the build logs for the packages by running `pnpm exec pm2 logs packages` or run `make logs`.

Run `make help` for all available commands.

You can run the repo locally. There's no https support yet and you'll have to look into .gitpod.yml to see the env requirements.

## Roadmap

0. Do everything.
1. Handle authentication and offer tools for offline authentication (if offline data is available)
2. Encrypt user data
  * Consider putting encryption logic into web worker for client performance
  * The query persister needs to have access to app context like user credentials.
3. Find the best way to prefetch "all necessary" data on app initialization. E.g.:
  * Require devs to handle it themselves
  * Offer global config, this still requires duplicated explicit naming of the endpoints (in component and in config)
  * Parse codebase during build process and prefetch data if queries satisfy a prefetch signal. How should that look? What about paginated queries? How to handle dynamic useQuery calls? This is impossible:
  ```
  { prefetch, ...someQuery } = useQuery({
    queryKey: ['todos', todoId],
    queryFn: async () => await fetchTodoById(todoId)
  })
  ```
4. 
