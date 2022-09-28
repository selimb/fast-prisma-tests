#!/usr/bin/env bash
set -eux

docker container run --rm -d \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -p 5432:5432 \
    -v fast-prisma-tests-pg-data:/var/lib/postgresql/data \
    --name fast-prisma-tests-pg \
    postgres:13.7-alpine \
    postgres -c "log_statement=all"
