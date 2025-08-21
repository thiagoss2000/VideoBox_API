# 📘 Documentação API – VideoBox

###Criar novo usuário

POST /sign-up

Cabeçalho:

Content-Type: application/json

Requisição JSON:

{
  "name": "Maria",
  "email": "maria@email.com",
  "password": "senha123",
  "confirmPassword": "senha123"
}

Respostas:

    201: Usuário criado

    409: E-mail já cadastrado

    422: Dados inválidos

###Login do usuário

POST /sign-in

Cabeçalho:

Content-Type: application/json

Requisição JSON:

{
  "email": "maria@email.com",
  "password": "senha123"
}

Resposta:

    200: Login OK

{ "token": "uuid-gerado" }

    401: Senha incorreta

    422: Dados inválidos

###Obter preferências do usuário

GET /preferences

Cabeçalho:

Authorization: Bearer <token>

Resposta:

    200: Preferências do usuário

{
  "_id": "0x0x0x0x0x0x0x0x0x0x0x0x"
  "user": "0x0x0x0x0x0x0x0x0x0x0x0x"
  "channelBlock": [],
  "themeVideo": [
    "music"
  ],
  "language": "en",
  "theme": "dark",
  "timeLimit": 8
}

    500: Erro interno do servidor

###Atualizar preferências do usuário (um ou mais campos)

PATCH /preferences/ambient

Cabeçalho:

Authorization: Bearer <token>
Content-Type: application/json

Requisição JSON:

{
  "theme": "dark",
  "language": "en",
  "timeLimit": 8
}

    Campos opcionais, mas ao menos um deve ser enviado.

    theme: "light" ou "dark"

    language: "pt-BR" ou "en"

    timeLimit: número inteiro entre 1 e 24

Respostas:

    200: Preferências atualizadas

    422: Dados inválidos

    500: Erro interno do servidor

###Atualizar preferências de busca (canais bloqueados e/ou temas de interesse)

PATCH /preferences/search

Cabeçalho:

Authorization: Bearer <token>
Content-Type: application/json

Requisição JSON:

{
  "add":{
    "channelBlock":["dark"],
    "themeVideo":["music"]
  },
  "remove":{
    "channelBlock":["dark"]
  }
}

    Campos opcionais, mas ao menos um deve ser enviado.

    add: 'channelBlock' ou 'themeVideo'

    remove: 'channelBlock' ou 'themeVideo'

Respostas:

    200: Preferências atualizadas

    422: Dados inválidos

    500: Erro interno do servidor

###Retornar recomendações de vídeo

get /timeline

Cabeçalho:

Authorization: Bearer <token>
Content-Type: application/json

query?newList=true (opcional)

parametro newList, força geração de nova lista de recomendações

Respostas:

    200: Preferências atualizadas

    500: Erro interno do servidor

###Retornar reaultado da busca de vídeos

get /timeline/search

Cabeçalho:

Authorization: Bearer <token>
Content-Type: application/json

query?search="título buscado"

Respostas:

    200: Preferências atualizadas

    422: Dados inválidos

    500: Erro interno do servidor

Observações

    Use o token retornado no login para autenticar rotas protegidas.

    Senhas são armazenadas de forma segura (bcrypt).

    Tokens são UUIDs vinculados a sessões no banco.

Autor

Thiago Santana Souza
