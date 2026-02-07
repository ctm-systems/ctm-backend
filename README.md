# API - CT Mineral

![GitHub pull requests](https://img.shields.io/github/issues-pr/ctm-systems/ctm-backend)
![GitHub issues](https://img.shields.io/github/issues/ctm-systems/ctm-backend)
![GitHub stars](https://img.shields.io/github/stars/ctm-systems/ctm-backend)
![GitHub forks](https://img.shields.io/github/forks/ctm-systems/ctm-backend)

## Sumário
- [Descrição](#descrição)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Instruções de inicialização da aplicação](#instruções-de-inicialização-da-aplicação)
- [Mecanismo de autenticação](#mecanismo-de-autenticação)
- [Regras de autorização](#regras-de-autorização)
- [Configuração de credenciais de acesso](#configuração-de-credenciais-de-acesso)
- [Exemplos de requisições (Insomnia)](#exemplos-de-requisições-insomnia)

## Descrição

O sistema desenvolvido consiste em uma API corporativa voltada para a gestão de processos do CT Mineral, permitindo o gerenciamento de usuários, clientes, técnicos, amostras, orçamentos e processos. Além disso, o sistema implementa mecanismos de segurança, incluindo autenticação para identificação dos usuários e autorização baseada em perfis, garantindo que apenas usuários devidamente autorizados possam acessar ou modificar determinados recursos.

## Tecnologias Utilizadas

* **Node.js** – Ambiente de execução JavaScript;

* **AdonisJS** – Framework backend para construção da API;

* **PostgreSQL** – Sistema de gerenciamento de banco de dados relacional;

* **Docker** – Containerização da aplicação;

* **Docker Compose** – Orquestração dos serviços (API e banco de dados).

* **Axios** – Cliente HTTP utilizado para consumo e integração com a API;

* **SUAP** (Sistema Unificado de Administração Pública) – Autenticação institucional via OAuth2;

## Instruções de Inicialização da Aplicação

1. Clone o repositório:

``` 
git clone https://github.com/ctm-systems/ctm-backend
```

2. Acesse a pasta do sistema:

``` 
cd ctm-backend
```

3. Suba a aplicação com Docker Compose:
``` 
docker compose up --build
```

4. Após a inicialização, a API estará disponível em:
```
http://localhost:3333
```

## Mecanismo de Autenticação

O projeto utiliza autenticação OAuth2 via SUAP (Sistema Unificado de Administração Pública) do IFRN.

### Fluxo de Autenticação OAuth2

1. **Geração da URL de Autorização**
   - O endpoint `/auth/url` gera uma URL de autorização OAuth2
   - Redireciona o usuário para o servidor SUAP com os parâmetros necessários

2. **Callback e Troca do Código**
   - O SUAP redireciona para `/auth/callback` com um código de autorização
   - O sistema troca este código por um token de acesso via API do SUAP
   - O token é validado e as informações do usuário são recuperadas

3. **Armazenamento Seguro do Token**
   - O token é armazenado em cookie httpOnly para máxima segurança
   - Configurações do cookie:
     - `httpOnly: true` - Não acessível via JavaScript
     - `secure: true` - Transmitido apenas via HTTPS
     - `sameSite: 'lax'` - Proteção contra ataques CSRF

4. **Validação Contínua**
   - O middleware `AuthSuapMiddleware` valida o token em cada requisição
   - Tokens inválidos são automaticamente removidos
   - Usuários não autenticados recebem status 401

### Endpoints de Autenticação

- `GET /auth/url` - Retorna URL de autenticação com SUAP
- `POST /auth/callback` - Recebe o *code* e faz a troca pelo token
- `GET /data` - Retorna dados do usuário autenticado
- `POST /logout` - Remove o token e encerra a sessão

## Regras de Autorização

O sistema implementa controle de acesso baseado em funções (RBAC - Role-Based Access Control).

### Sistema de Roles

**Roles Disponíveis:**
- `diretor` - Acesso administrativo completo
- `tecnico` - Acesso limitado a operações específicas

### Estrutura de Permissões

1. **Validação de Usuário Local**
   - Após autenticação SUAP, verifica se a matrícula existe na base local
   - Apenas usuários cadastrados na tabela `tecnicos` têm acesso ao sistema

2. **Atribuição de Roles**
   - Roles são atribuídas via relacionamento many-to-many na tabela `tecnico_roles`

3. **Verificação de Permissões**
   - O middleware `RoleMiddleware` verifica se o usuário possui a role necessária

### Níveis de Acesso

**Acesso Autenticado (qualquer usuário logado):**
- Dados do usuário: `GET /data`
- Logout: `POST /logout`
- Listagem de técnicos: `GET /tecnicos`
- Detalhes de técnico: `GET /tecnicos/:id`
- Listagem de processos: `GET /processos`
- Detalhes de processo: `GET /processos/:id`

**Acesso Restrito (role `diretor`):**
- Criar técnico: `POST /tecnicos`
- Atualizar técnico: `PUT/PATCH /tecnicos/:id`
- Deletar técnico: `DELETE /tecnicos/:id`
- Criar processo: `POST /processos`
- Atualizar processo: `PUT/PATCH /processos/:id`
- Deletar processo: `DELETE /processos/:id`

### Fluxo de Autorização

1. **Autenticação via SUAP** - Usuário se autentica usando credenciais institucionais
2. **Validação Local** - Sistema verifica se a matrícula existe na base de dados local
3. **Carregamento de Roles** - Busca as permissões associadas ao usuário
4. **Verificação de Acesso** - Para cada requisição, valida se o usuário possui a role necessária
5. **Resposta** - Permite acesso ou retorna erro 403

### Middleware de Segurança

- `AuthSuapMiddleware` - Valida autenticação OAuth2
- `RoleMiddleware` - Verifica permissões baseadas em roles

## Configuração de Credenciais de Acesso

### Credenciais para Desenvolvimento e Testes

Para testar o sistema, você precisa de credenciais válidas do SUAP (Sistema Unificado de Administração Pública) do IFRN.

### 1. Credenciais de Teste do SUAP

**Para Ambiente de Desenvolvimento:**
- **Credenciais:** Use suas credenciais institucionais do IFRN (matrícula e senha)
- **Tipos de usuário aceitos:**
  - Servidores técnico-administrativos
  - Professores
  - Estudantes (com matrícula válida)

### 2. Configuração OAuth2 no SUAP

Antes de usar o sistema, é necessário registrar a aplicação no SUAP:

1. **Acesse:** https://suap.ifrn.edu.br/o/applications/
2. **Crie uma nova aplicação** com as seguintes configurações:
   - **Client type:** `Confidential`
   - **Authorization grant type:** `Authorization code`
   - **Redirect URI:** `http://localhost:5173/callback` (caso tenha uma aplicação front-end ou deseje pegar o *code* na URL do navegador)
   - **Name:** Nome da sua aplicação (ex: "CTM Backend")

3. **Anote as credenciais geradas:**
   - `Client ID`
   - `Client Secret`

### 3. Configuração das Variáveis de Ambiente

Configure as credenciais no arquivo `.env`:

```bash
# OAuth2 SUAP
SUAP_CLIENT_ID=seu_client_id_aqui
SUAP_CLIENT_SECRET=seu_client_secret_aqui
SUAP_REDIRECT_URI=http://localhost:5173/callback # Caso tenha uma aplicação front-end
```

### 4. Usuários de Teste Pré-configurados

O sistema vem com usuários de teste configurados nos seeders:

**Diretores (Acesso Completo):**
- **Matrícula:** `1886551`
- **Nome:** `Keylly`
- **Roles:** `diretor`

- **Matrícula:** `20241038060006`
- **Nome:** `Jardson`
- **Roles:** `diretor`

- **Matrícula:** `20241038060011`
- **Nome:** `Ian`
- **Roles:** `diretor`

**Técnico (Acesso Limitado):**
- **Matrícula:** `20241038060010`
- **Nome:** `Robério`
- **Roles:** `tecnico`

### 5. Fluxo de Teste Completo

1. **Configure as variáveis de ambiente** com suas credenciais OAuth2
2. **Execute o comando para rodar o Docker:**
```
docker compose up --build
```
4. **Acesse:** GET `http://localhost:3333/auth/url` (para pegar a URL de autenticação) 
5. **Faça login com suas credenciais do SUAP**
6. **Na URL da tela de callback:** `http://localhost:5173/callback` (pegue o *code* que está na URL)
7. **Na URL de callback da API:** POST `http://localhost:3333/auth/url` (passe o *code* como payload)
```
{
  "code": "coloque_aqui_o_code"
}
```
8. **Verifique se sua matrícula está cadastrada** no sistema local

### 6. Solução de Problemas Comuns

**Erro 403 após login:**
- Verifique se sua matrícula está cadastrada na tabela `tecnicos`
- Adicione sua matrícula via seeder

**Erro de OAuth2:**
- Verifique se as credenciais `SUAP_CLIENT_ID` e `SUAP_CLIENT_SECRET` estão corretas
- Confirme se a `SUAP_REDIRECT_URI` está registrada no SUAP

**Token inválido:**
- Limpe os cookies do navegador
- Refaça o processo de login

### 7. Credenciais para Produção

**Para ambiente de produção:**
- Registre uma nova aplicação OAuth2 no SUAP com a URL de produção
- Use variáveis de ambiente seguras
- Configure HTTPS obrigatório
- Atualize a `SUAP_REDIRECT_URI` para o domínio de produção

## Exemplos de Requisições (Insomnia)

### Gerar URL de autenticação

* Método: **GET**
* URL:

```
http://localhost:3333/auth/url
```

A resposta retornará uma URL.

* Copie a URL retornada
* Abra no navegador
* Faça login com:

  * Matrícula: [Sua matrícula]
  * Senha: [Senha do SUAP]

### Obter o código de autenticação

Após o login, você será redirecionado para uma URL semelhante a:

```
http://localhost:5173/callback?code=XXX
```

<img src="./assets/callback.png"></img>

* Copie o valor do parâmetro `code`

### Validar o código e gerar token

Caso o código expire realize os passos anteriores para obter um novo código

* Método: **GET**
* URL:

```
http://localhost:3333/auth/callback
```

* Payload - Body (JSON):

```json
{
  "code": "SEU_CODIGO"
}
```

📌 Após a requisição:

* Vá até a aba **Cookies** no Insomnia
* Copie o valor do cookie:

  * **Key**: `suap_token`

### Configurar cookie manualmente no Insomnia

Em **Manage Cookies**, adicione:

* **Key**: `suap_token`
* **Value**: `SEU_TOKEN`
* **Path**: `/`
* **Domain**: `localhost`

Isso garantirá que as próximas requisições estejam autenticadas.

## Testes de Permissão (Usuário logado como Diretor)

### Listar técnicos

* Método: **GET**
* URL:

```
http://localhost:3333/tecnicos
```

* Escolha o `ID` de algum técnico retornado

### Deletar técnico (permitido para diretor)

* Método: **DELETE**
* URL:

```
http://localhost:3333/tecnicos/ID
```

O diretor possui permissão para deletar técnicos.

### Atualizar técnico (alterar papel)

* Método: **PUT**
* URL:

```
http://localhost:3333/tecnicos/SEU_ID
```

* Payload - Body (JSON):

```json
{
  "nome": "seu_nome",
  "matricula": "sua_matricula",
  "role_nome": "tecnico"
}
```

### Teste de restrição de permissão

Após alterar seu próprio papel para `tecnico`:

* Tente executar novamente:

```
DELETE http://localhost:3333/tecnicos/ID
```

Resultado esperado:

* Acesso **negado**, comprovando o funcionamento do controle de permissões (RBAC).
