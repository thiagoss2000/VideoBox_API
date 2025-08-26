import request from "supertest"
import app from "../server.js"
import { getAuthToken } from "./setup.js" // pega token do setup

describe("Preferências do usuário", () => {
  let token

  beforeAll(() => {
    token = getAuthToken() // define token antes dos testes
  })

  it("deve salvar preferência com tema válido", async () => {
    const res = await request(app)
      .patch("/preference/ambient")
      .set("token", `Bearer ${token}`)
      .send({ theme: "dark" })

    expect(res.status).toBe(200)
  })

  it("deve atualizar idioma e limite de tempo válidos", async () => {
    const res = await request(app)
      .patch("/preference/ambient")
      .set("token", `Bearer ${token}`)
      .send({ language: "pt-BR", timeLimit: 8 })

    expect(res.status).toBe(200)
  })

  it("deve retornar 422 para idioma inválido", async () => {
    const res = await request(app)
      .patch("/preference/ambient")
      .set("token", `Bearer ${token}`)
      .send({ language: "es" })

    expect(res.status).toBe(422)
    expect(res.body[0]).toMatch(/language.*must be one of/)
  })

  it("deve retornar 422 se nenhuma preferência for enviada", async () => {
    const res = await request(app)
      .patch("/preference/ambient")
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

  it("deve retornar 422 se nenhuma preferência for enviada no search", async () => {
    const res = await request(app)
      .patch("/preference/search")
      .set("token", `Bearer ${token}`)
      .send({})

    expect(res.status).toBe(422)
  })

  it("deve retornar 422 se preferência estiver vazia", async () => {
    const res = await request(app)
      .patch("/preference/search")
      .set("token", `Bearer ${token}`)
      .send({ add: {} })

    expect(res.status).toBe(422)
  })

  it("deve adicionar channelBlock e themeVideo", async () => {
    const res = await request(app)
      .patch("/preference/search")
      .set("token", `Bearer ${token}`)
      .send({
        add: {
          channelBlock: ["dark"],
          themeVideo: ["music"],
        },
      })

    expect(res.status).toBe(200)
  })

  it("deve retornar as preferências salvas corretamente", async () => {
    const res = await request(app)
      .get("/preference")
      .set("token", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.channelBlock).toContain("dark")
    expect(res.body.themeVideo).toContain("music")
  })

  it("deve adicionar channelBlock e themeVideo e remover item", async () => {
    const res = await request(app)
      .patch("/preference/search")
      .set("token", `Bearer ${token}`)
      .send({
        add: {
          channelBlock: ["dark"],
          themeVideo: ["music"],
        },
        remove: {
          channelBlock: ["dark"],
        },
      })

    expect(res.status).toBe(200)
  })

  it("deve retornar as preferências salvas corretamente após remoção", async () => {
    const res = await request(app)
      .get("/preference")
      .set("token", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.channelBlock).not.toContain("dark")
    expect(res.body.themeVideo).toContain("music")
  })
})
