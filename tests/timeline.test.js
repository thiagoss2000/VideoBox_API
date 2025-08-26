import request from "supertest"
import app from "../server.js"
import { getAuthToken } from "./setup.js" // pega token do setup

describe("Recomendações", () => {
  let token

  beforeAll(() => {
    token = getAuthToken() // pega o token global definido no setup
  })

  it("deve retornar lista com metadados de recomendações de vídeos", async () => {
    const res = await request(app)
      .get("/timeline")
      .set("token", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeInstanceOf(Object) // garante que é um objeto
    expect(res.body).toHaveProperty("recommendations") // tem a propriedade
  })
})