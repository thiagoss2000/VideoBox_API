import request from "supertest"
import app from "../server.js"

describe("Preferências do usuário", () => {
  let token

  beforeAll(() => {
    token = global.__TEST_TOKEN__
  })

  it("deve salvar preferência com tema válido", async () => {
    const res = await request(app)
      .patch("/preference")
      .set("token", `Bearer ${token}`)
      .send({ theme: "dark" })

    expect(res.status).toBe(200)
  })

  it("deve atualizar idioma e limite de tempo válidos", async () => {
    const res = await request(app)
      .patch("/preference")
      .set("token", `Bearer ${token}`)
      .send({ language: "pt-BR", timeLimit: 8 })

    expect(res.status).toBe(200)
  })

  it("deve retornar 422 para idioma inválido", async () => {
    const res = await request(app)
      .patch("/preference")
      .set("token", `Bearer ${token}`)
      .send({ language: "es" })

    expect(res.status).toBe(422)
    expect(res.body[0]).toMatch(/language.*must be one of/)
  })

  it("deve retornar 422 se nenhuma preferência for enviada", async () => {
    const res = await request(app)
      .patch("/preference")
      .set("token", `Bearer ${token}`)
      .send({})

    expect(res.status).toBe(422)
  })

  it("deve retornar as preferências salvas corretamente", async () => {
    const res = await request(app)
      .get("/preference")
      .set("token", `Bearer ${token}`) 

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("theme")
    expect(res.body).toHaveProperty("language")
    expect(res.body).toHaveProperty("timeLimit")
  })
})