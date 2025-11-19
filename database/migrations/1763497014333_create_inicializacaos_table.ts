import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('tecnicos', (table) => {
      table.increments('id')
      table.string('nome', 255).notNullable()
      table.string('matricula', 100).notNullable().unique()
      table.string('senha', 180).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('clientes', (table) => {
      table.increments('id')
      table.string('nome', 255).notNullable()
      table.string('cpf', 20).notNullable().unique()
      table.string('cnpj', 20).notNullable().unique()
      table.string('cep', 20).notNullable()
      table.string('endereco', 255).notNullable()

      table
        .integer('tecnico_id')
        .unsigned()
        .references('tecnicos.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('tipo_amostras', (table) => {
      table.increments('id')
      table.string('nome', 255).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('planilhas', (table) => {
      table.increments('id')
      table.string('arquivo', 255).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('processos', (table) => {
      table.increments('id')
      table.string('nome', 255).notNullable()
      table.decimal('preco', 12, 2).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('amostras', (table) => {
      table.increments('id')
      table.string('nome', 255).notNullable()
      table.string('foto', 255).notNullable()
      table.datetime('data_recebimento').notNullable()

      table
        .integer('cliente_id')
        .unsigned()
        .references('clientes.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .integer('tipo_amostra_id')
        .unsigned()
        .references('tipo_amostras.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .integer('processo_id')
        .unsigned()
        .references('processos.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('orcamentos', (table) => {
      table.increments('id')
      table.string('identificacao', 100).notNullable().unique()
      table.decimal('valor_orcamento', 12, 2).notNullable()
      table.enum('status', ['PENDENTE', 'APROVADO', 'RECUSADO']).notNullable().defaultTo('PENDENTE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('laudos', (table) => {
      table.increments('id')

      table
      .integer('cliente_id')
      .unsigned()
      .references('clientes.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')

      table
      .integer('planilha_id')
      .unsigned()
      .references('planilhas.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')

      table
      .integer('orcamento_id')
      .unsigned()
      .references('orcamentos.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')

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
