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
