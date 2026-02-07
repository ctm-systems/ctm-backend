import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import { Roles } from '#models/role'

const AuthSuapController = () => import('#controllers/auth_suaps_controller')

const AmostraController = () => import('#controllers/amostras_controller')
const ClientesController = () => import('#controllers/clientes_controller')
const OrcamentosController = () => import('#controllers/orcamentos_controller')
const PlanilhasController = () => import('#controllers/planilhas_controller')
const ProcessosController = () => import('#controllers/processos_controller')
const TecnicosController = () => import('#controllers/tecnicos_controller')
const TiposAmostrasController = () => import('#controllers/tipos_amostras_controller')

const AmostrasProcessosController = () => import('#controllers/amostras_processos_controller')
const TecnicosClientesController = () => import('#controllers/tecnicos_clientes_controller')
const OrcamentosAmostrasController = () => import('#controllers/orcamentos_amostras_controller')

router.get('/', async () => {
  return {
    hello: 'Funcionando',
  }
})

router.get('/auth/url', [AuthSuapController, 'getAuthUrl'])
router.post('/auth/callback', [AuthSuapController, 'callback'])

router
  .group(() => {
    router.get('/data', [AuthSuapController, 'getData'])
    router.get('/logout', [AuthSuapController, 'logout'])

    router.resource('/amostras', AmostraController).except(['create', 'edit'])
    router.resource('/clientes', ClientesController).except(['create', 'edit'])
    router.resource('/orcamentos', OrcamentosController).except(['create', 'edit'])
    router.resource('/planilhas', PlanilhasController).except(['create', 'edit'])
    router.get('/planilhas/:id/download', [PlanilhasController, 'download'])
    router.resource('/processos', ProcessosController).only(['index', 'show'])
    router.resource('/tecnicos', TecnicosController).only(['index', 'show'])
    router.resource('/tipos-amostras', TiposAmostrasController).except(['create', 'edit'])

    router.post('/clientes/:id/adicionar-tecnico', [TecnicosClientesController, 'attach'])
    router.post('/clientes/:id/remover-tecnico', [TecnicosClientesController, 'detach'])

    router.post('/amostras/:id/adicionar-processo', [AmostrasProcessosController, 'attach'])
    router.post('/amostras/:id/remover-processo', [AmostrasProcessosController, 'detach'])

    router.post('/orcamentos/:id/adicionar-amostra', [OrcamentosAmostrasController, 'attach'])
    router.post('/orcamentos/:id/remover-amostra', [OrcamentosAmostrasController, 'detach'])

    router
      .group(() => {
        router.resource('/tecnicos', TecnicosController).except(['index', 'show'])
        router.resource('/processos', ProcessosController).except(['index', 'show'])
      })
      .use([middleware.role([Roles.diretor])])
  })
  .use([middleware.authSuap()])
