# Planne Challenge: API de Gerenciamento de Baldes e Frutas com Node, Express e MongoDB

API construida utilizando Node, Express e MongoDB (Mongoose).
Nela é possivel:
- Criar e excluir Baldes (*Buckets*)
- Criar e excluir Frutas (*Fruits*)
- Depositar e remover Frutas de um Balde
- Obter uma listagem de Frutas
- Obter uma listagem de Baldes, com o valor total da soma dos preços das Frutas, porcentagem de ocupação do Balde e ordenado de modo decrescente pela sua ocupação.

Obs: Todas as Frutas possuem um período de expiração e são removidas dos Baldes e tem o registro apagado de forma automática (utilizando TTL do MongoDB).

## Principais tecnologias

- **Node.js**
- **Express**: Framework para Node.js.
- **MongoDB/Mongoose**: Banco de dados não relacional.
- **Joi/celebrate**: Biblioteca para validação dos dados de entrada dos endpoints.
- **Swagger**: Ferramenta de documentação da API.
- **Docker**: Plataforma de contêineres para desenvolvimento, empacotamento e execução de aplicações.
- **Jest**: Biblioteca para execução de testes unitários.


## Início Rápido (docker-compose)

A forma mais rápida para iniciar essa aplicação é utilizando o `docker-compose`.
Para isso, basta executar o seguinte comando na raiz do projeto:

```bash
docker-compose up --build
```

Assim, 2 containers serão criados, sendo o primeiro do MongoDB e o segundo da API (Node).

A API ficará disponível em http://localhost:3000.

A documentação da API é fornecida utilizando o *Swagger*, que simplifica a exploração e compreensão dos endpoints disponíveis na aplicação. A documentação pode ser acessada em http://localhost:3000/api-docs.

> A lib `nodemon` é utilizada para realizar o auto-reload, o que significa que qualquer alteração no código será refletida automaticamente, sem a necessidade de reiniciar manualmente a aplicação.

## Instalação manual (yarn/npm)

Também é possível iniciar a API utilizando yarn ou npm. Para isso, basta seguir os seguintes passos:

### 1. Criar env file

Primeiro, crie um arquivo `.env` na raiz do projeto e adicione a URL do banco de dados. Ex:
```
DATABASE_URL=mongodb://root:root@127.0.0.1:27017
```

### 2. Instalar dependencias

Basta executar `yarn` ou `npm install`

### 3. Iniciar aplicação

Basta executar `yarn dev` ou `npm run dev`

## Endpoints da API

O detalhamento dos endpoints, juntamente com exemplos de inputs e de respostas da API, podem ser vistos na URL http://localhost:3000/api-docs assim que a API estiver rodando. Porém, segue um resumo abaixo dos endpoints existentes nessa aplicação:

### Buckets

- POST `http://localhost:3000/buckets`: Criar um Balde.
- GET `http://localhost:3000/buckets`: Lista de Baldes ordenados por porcentagem de ocupação de forma decrescente.
- DELETE `http://localhost:3000/buckets/:bucketId`: Deletar um Balde (se estiver vazio)
- POST `http://localhost:3000/buckets/:bucketId/fruits`: Adiciona Frutas a um Balde.
- DELETE `http://localhost:3000/buckets/:bucketId/fruits/:fruitId`: Remove Frutas de um Balde.

### Fruits
- POST `http://localhost:3000/fruits`: Criar uma Fruta.
- GET `http://localhost:3000/fruits`: Listar Frutas.
- DELETE `http://localhost:3000/fruits/:fruitId`: Deletar Frutas.

## Testes unitários

Testes unitários foram criados para validar os mais variados cenários, oferecendo a seguinte cobertura:

![alt text](jest-coverage.png)

Para rodar os testes, basta executar o comando:
```
yarn test
```
