# Fast Prisma Tests

Companion repo for my blog post: [Speedy Prisma+PostgreSQL Tests](https://selimb.hashnode.dev/speedy-prisma-pg-tests).
Based on Prisma's official [testing-express](https://github.com/prisma/prisma-examples/tree/latest/typescript/testing-express) example.
The first commit in this repo is in fact a copy of that example.

## Setup

### 1. Install NPM dependencies

```
$ npm install
```

### 2. Start the database

You can run the following to start a new PostgreSQL Docker container:

```
$ ./scripts/pg-docker.sh
```

You're otherwise free to start postgres however you'd like.

### 3. Configuration

Rename the `.env.example` file to `.env`, and make sure `DB_URL` is accurate -- if you started postgres with `pg-docker.sh`, then you don't need to change anything.

## Running Tests

```
$ npm test
```
