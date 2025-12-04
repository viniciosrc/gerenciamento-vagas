import kn from 'knex'
import type { Knex } from 'knex'

export const configKnex: Knex.Config = {
    client: 'pg',
    connection: {
        connectionString: 'postgresql://postgres:root@localhost:5432/paradigmas_dhc',
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        database: 'paradigmas_dhc',
        password: 'root',
    },
    migrations: {
        extension: 'ts',
        directory: './database/migrations',
    },
}

export const knex = kn(configKnex)