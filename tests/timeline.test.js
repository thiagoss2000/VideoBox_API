import request from "supertest"
import app from "../server.js"

describe("recomendações", () => {
    let token

    beforeAll(() => {
        token = global.__TEST_TOKEN__
    })

    it("deve retornar lista com metadados de recomendações de videos", async () => {
        const res = await request(app)
            .get("/timeline")
            .set("token", `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Object) // garante que é um objeto
        expect(res.body).toHaveProperty("recommendations") // tem a propriedade
    })


})
