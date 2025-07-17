import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { MongoClient } from 'mongodb'
import supertest from 'supertest'
import app from './server.js' // ajuste para o caminho correto do seu app Express

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '.env.test') })

const client = new MongoClient(process.env.MONGO_URI)
let db

beforeAll(async () => {
  await client.connect()
  db = client.db(process.env.MONGO_DB)

  // Limpa todas as coleções
  const collections = await db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }

  // Expor banco e client para testes
  global.__DB__ = db
  global.__DB_CLIENT__ = client

  console.log(`[Jest Setup] Banco ${process.env.MONGO_DB} limpo`)

  // Criar usuário de teste e pegar token usando sua API real (supertest)
  const api = supertest(app)

  const user = {
    name: "globaluser",
    email: "globaluser@teste.com",
    password: "testeteste",
    confirmPassword: "testeteste",
  }

  // Tenta criar usuário, ignora erro se existir
  await api.post("/sign-up").send(user).catch(() => {})

  const loginRes = await api.post("/sign-in").send({
    email: user.email,
    password: user.password,
  })

  global.__TEST_TOKEN__ = loginRes.body.token
  console.log('[Jest Setup] Token global criado')
})

afterAll(async () => {
  const collections = await db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }

  await client.close()
  console.log('[Jest Setup] Conexão com o banco encerrada')
})