import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthSuapController = () => import('#controllers/auth_suaps_controller')

const AmostraController = () => import('#controllers/amostras_controller')
const ClientesController = () => import('#controllers/clientes_controller')
const LaudosController = () => import('#controllers/laudos_controller')
const OrcamentosController = () => import('#controllers/orcamentos_controller')
const PlanilhasController = () => import('#controllers/planilhas_controller')
const ProcessosController = () => import('#controllers/processos_controller')
const TecnicosController = () => import('#controllers/tecnicos_controller')
const TiposAmostrasController = () => import('#controllers/tipos_amostras_controller')

const AmostrasProcessosController = () => import('#controllers/amostras_processos_controller')
const TecnicosClientesController = () => import('#controllers/tecnicos_clientes_controller')
const OrcamentosAmostrasController = () => import('#controllers/orcamentos_amostras_controller')
const LaudosPlanilhasController = () => import('#controllers/laudos_planilhas_controller')

router.get('/', async () => {
  return {
    hello: 'Funcionando',
  }
})

router.post('/login', [AuthSuapController, 'login']).use([middleware.checkAuthorizedUser()])

router
  .group(() => {
    router.get('/data', [AuthSuapController, 'getData'])
    router.get('/logout', [AuthSuapController, 'logout'])

    router.resource('/amostras', AmostraController).except(['create', 'edit'])
    router.resource('/clientes', ClientesController).except(['create', 'edit'])
    router.resource('/laudos', LaudosController).except(['create', 'edit'])
    router.resource('/orcamentos', OrcamentosController).except(['create', 'edit'])
    router.resource('/planilhas', PlanilhasController).except(['create', 'edit'])
    router.get('/planilhas/:id/download', [PlanilhasController, 'download'])
    router.resource('/processos', ProcessosController).except(['create', 'edit'])
    router.resource('/tecnicos', TecnicosController).except(['create', 'edit'])
    router.resource('/tipos-amostras', TiposAmostrasController).except(['create', 'edit'])

    router.post('/clientes/:id/adicionar-tecnico', [TecnicosClientesController, 'attach'])
    router.post('/clientes/:id/remover-tecnico', [TecnicosClientesController, 'detach'])

    router.post('/amostras/:id/adicionar-processo', [AmostrasProcessosController, 'attach'])
    router.post('/amostras/:id/remover-processo', [AmostrasProcessosController, 'detach'])

    router.post('/orcamentos/:id/adicionar-amostra', [OrcamentosAmostrasController, 'attach'])
    router.post('/orcamentos/:id/remover-amostra', [OrcamentosAmostrasController, 'detach'])

    router.post('/laudos/:id/adicionar-planilha', [LaudosPlanilhasController, 'attach'])
    router.post('/laudos/:id/remover-planilha', [LaudosPlanilhasController, 'detach'])
  })
  .use([middleware.authSuap()])
