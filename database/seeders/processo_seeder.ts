import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Processo from '#models/processo'

export default class extends BaseSeeder {
  async run() {
    await Processo.createMany([
      {
        nome: 'FRX',
        preco: 100,
      },
      {
        nome: 'DRX',
        preco: 100,
      },
      {
        nome: 'Britagem',
        preco: 10,
      },
      {
        nome: 'Moinho de Anéis',
        preco: 15,
      },
      {
        nome: 'Homogeneização e Quarteamento',
        preco: 30,
      },
      {
        nome: 'Pulverização',
        preco: 16.16,
      },
    ])
  }
}
