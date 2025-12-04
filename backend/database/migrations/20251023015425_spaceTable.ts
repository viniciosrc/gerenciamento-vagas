import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('spaces', (table) => {
        table.string('id').primary()
        table.timestamps(true, true)
        table.boolean('status').defaultTo(false).notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('spaces')
}
