# Back End - Meetapp

Este projeto foi desenvolvido utilizando **Yarn**, **NodeJS** e **Docker**, então é importante ter essas ferramentas instaladas na máquina antes de continuar.

https://www.docker.com

https://nodejs.org/en/

https://yarnpkg.com/lang/en/

## Docker

### Criação

Rode os seguintes comandos para criar os containers:

**Postgress**

`docker run --name meetappPostgres -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=meetapp -p 5433:5432 -d postgres`

**Redis**

`docker run --name meetappRedis -p 6379:6379 -d -t redis:alpine`

_Referência de comandos Docker:_

- `docker ps -a` => lista todos os container existentes no Docker

- `docker start CONTAINER_ID` => inicia o container especifico

## Configurações da aplicação

Crie um arquivo chamado `.env` na raiz desse projeto e o preencha com as informações corretas de acordo com o arquivo `.env-example`. Será necessário ter uma conta nos seguintes sites para preencher o arquivo:

https://mailtrap.io/

https://sentry.io/welcome/

### Migrations

Rode o seguinte comando para importar as migrations:

`yarn sequelize db:migrate`

### Seeders

Rode o seguinte comando para importar os Seeds:

`yarn sequelize db:seed:all`

_Obs: não rode o comando mais do que uma vez. Os seeds possuem um ID específico sendo definidos manualmente para que haja relação entre os dados genéricos inseridos. Caso seja rodado mais do que uma vez, ocorrerá um erro pois estará tentando inserir 2 IDs iguais._

## Rodando a aplicação

Para rodar a aplicação, execute o comando `yarn` para instalar as dependências. Em seguida será necessário iniciar o servidor padrão e o servidor de filas com os seguintes comandos em terminais separados:

`yarn dev` => Servidor padrão

`yarn queue` => Servidor com gerenciamento de Filas

## Testes

Para rodar os testes da aplicação, execute:

`yarn test`
