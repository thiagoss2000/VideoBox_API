import { connectDB, closeDB, getDB as getDatabase } from "../config/db.js"
import app from "../server.js"
import request from "supertest"

let token
const collectionsToClean = ["users","sessions", "preferences", "timeline"]

// Função para limpar collections
async function cleanCollections() {
  const db = getDatabase()
  for (const name of collectionsToClean) {
    await db.collection(name).deleteMany({})
  }
}

// Executa antes de todos os testes
beforeAll(async () => {
  await connectDB()
  await cleanCollections()

  // Cria usuário de teste
  await request(app)
    .post("/sign-up")
    .send({
      name: "user",
      email: "test@teste.com",
      password: "testeteste",
      confirmPassword: "testeteste"
    })

  // Faz login e obtém token
  const res = await request(app)
    .post("/sign-in")
    .send({ email: "test@teste.com", password: "testeteste" })

  token = res.body.token
})

// Executa após todos os testes
afterAll(async () => {
  await cleanCollections()
  await closeDB()
})

// Disponibiliza token globalmente para outros testes
export function getAuthToken() {
  return token
}

// Disponibiliza DB para manipulação direta de collections, se necessário
export function getDB() {
  return getDatabase()
}