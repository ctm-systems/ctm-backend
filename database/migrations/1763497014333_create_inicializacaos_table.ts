import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('tecnicos', (table) => {
      table.increments('id')
      table.string('nome', 255).notNullable()
      table.string('matricula', 100).notNullable().unique()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('clientes', (table) => {
      table.increments('id')
      table.string('nome', 255).notNullable()
      table.string('email', 255).unique()
      table.string('telefone', 30).notNullable()
      table.string('cpf', 20).unique()
      table.string('cnpj', 20).unique()
      table.string('cep', 20).notNullable()
      table.string('endereco', 255).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('tecnico_cliente', (table) => {
      table.increments('id')

      table
        .integer('tecnico_id')
        .unsigned()
        .references('tecnicos.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .integer('cliente_id')
        .unsigned()
        .references('clientes.id')
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

    this.schema.createTable('processos', (table) => {
      table.increments('id')
      table.string('nome', 255).notNullable()
      table.decimal('preco', 12, 2).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('orcamentos', (table) => {
      table.increments('id')
      table.string('identificacao', 100).notNullable().unique()
      table.enum('status', ['PENDENTE', 'APROVADO', 'RECUSADO']).notNullable().defaultTo('PENDENTE')

      table
        .integer('cliente_id')
        .unsigned()
        .references('clientes.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('amostras', (table) => {
      table.increments('id')
      table.string('nome', 255).notNullable()
      table.string('foto', 255)
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
        .integer('orcamento_id')
        .unsigned()
        .references('orcamentos.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('amostra_processos', (table) => {
      table.increments('id')

      table
        .integer('amostra_id')
        .unsigned()
        .references('amostras.id')
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

    this.schema.createTable('laudos', (table) => {
      table.increments('id')

      table
        .integer('cliente_id')
        .unsigned()
        .references('clientes.id')
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

    this.schema.createTable('planilhas', (table) => {
      table.increments('id')
      table.string('arquivo', 255).notNullable()
      
      table
        .integer('laudo_id')
        .unsigned()
        .references('laudos.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable('planilhas')
    this.schema.dropTable('laudos')
    this.schema.dropTable('amostra_processos')
    this.schema.dropTable('amostras')
    this.schema.dropTable('orcamentos')
    this.schema.dropTable('processos')
    this.schema.dropTable('tipo_amostras')
    this.schema.dropTable('tecnico_cliente')
    this.schema.dropTable('clientes')
    this.schema.dropTable('tecnicos')
  }
}
