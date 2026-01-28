import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Processo from '#models/processo'

export default class extends BaseSeeder {
  async run() {
    const processos = [
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
    ]

    for (const item of processos) {
      await Processo.updateOrCreate({ nome: item.nome }, { preco: item.preco })
    }
  }
}
