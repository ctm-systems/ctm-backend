import { BaseSeeder } from '@adonisjs/lucid/seeders'
import TipoAmostra from '#models/tipo_amostra'
import { TipoAmostraNome } from '#models/tipo_amostra'

export default class extends BaseSeeder {
  async run() {
    await TipoAmostra.createMany([
      {
        nome: TipoAmostraNome.MINERIO,
      },
      {
        nome: TipoAmostraNome.POLPA,
      },
      {
        nome: TipoAmostraNome.REJEITO,
      },
      {
        nome: TipoAmostraNome.SEDIMENTO,
      },
      {
        nome: TipoAmostraNome.SOLO,
      },
      {
        nome: TipoAmostraNome.TESTEMUNHO,
      },
    ])
  }
}
