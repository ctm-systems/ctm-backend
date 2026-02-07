import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('roles', (table) => {
      table.increments('id')
      table.enum('nome', ['diretor', 'tecnico']).notNullable().unique()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('tecnico_roles', (table) => {
      table.increments('id')
      table.integer('tecnico_id').unsigned().references('tecnicos.id').onDelete('CASCADE')
      table.integer('role_id').unsigned().references('roles.id').onDelete('CASCADE')
      table.unique(['tecnico_id', 'role_id'])
    })
  }

  async down() {
    this.schema.dropTable('tecnico_roles')
    this.schema.dropTable('roles')
  }
}
