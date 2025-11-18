import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('tecnicos', (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('clientes', (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('tipo_amostras', (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('planilhas', (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('processos', (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('amostras', (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('orcamentos', (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('laudos', (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable('tecnicos')
    this.schema.dropTable('clientes')
    this.schema.dropTable('tipo_amostras')
    this.schema.dropTable('planilhas')
    this.schema.dropTable('processos')
    this.schema.dropTable('amostras')
    this.schema.dropTable('orcamentos')
    this.schema.dropTable('laudos')
  }
}