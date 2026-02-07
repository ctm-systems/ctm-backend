# Descrição

O sistema desenvolvido consiste em uma API corporativa voltada para a gestão de processos do CT Mineral, permitindo o gerenciamento de usuários, clientes, técnicos, amostras, orçamentos e processos. Além disso, o sistema implementa mecanismos de segurança, incluindo autenticação para identificação dos usuários e autorização baseada em perfis, garantindo que apenas usuários devidamente autorizados possam acessar ou modificar determinados recursos.

# Tecnologias Utilizadas

* **Node.js** – Ambiente de execução JavaScript;

* **AdonisJS** – Framework backend para construção da API;

* **PostgreSQL** – Sistema de gerenciamento de banco de dados relacional;

* **Docker** – Containerização da aplicação;

* **Docker Compose** – Orquestração dos serviços (API e banco de dados).

* **Axios** – Cliente HTTP utilizado para consumo e integração com a API;

* **SUAP** (Sistema Unificado de Administração Pública) – Autenticação institucional via OAuth;

# Instruções de Inicialização da Aplicação

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
docker compose up
```

4. Após a inicialização, a API estará disponível em:
```
http://localhost:3333
```