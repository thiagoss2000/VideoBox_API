import request from "supertest"
import app from "../server.js"
import { getDB } from "./setup.js"

describe("POST /sign-up", () => {
  const userEmail = "user@teste.com"
  let db

  beforeAll(() => {
    db = getDB()
  })

  afterEach(async () => {
    await db.collection("users").deleteMany({ email: userEmail })
  })

  it("entrada padrão, novo usuário", async () => {
    const newUser = {
      name: "user",
      email: userEmail,
      password: "testeteste",
      confirmPassword: "testeteste"
    }
    const response = await request(app).post("/sign-up").send(newUser)
    expect(response.status).toBe(201)
  })

  it("entrada padrão, email já cadastrado", async () => {
    await db.collection("users").insertOne({
      name: "user",
      email: userEmail,
      password: "hash" // hash fake, só pra teste
    })

    const newUser = {
      name: "user",
      email: userEmail,
      password: "testeteste",
      confirmPassword: "testeteste"
    }

    const response = await request(app).post("/sign-up").send(newUser)
    expect(response.status).toBe(409)
  })

  it("dados incompletos", async () => {
    const response = await request(app).post("/sign-up").send({ name: "Maria" })

    expect(response.status).toBe(422)
    expect(response.body).toEqual([
      "\"email\" is required",
      "\"password\" is required",
      "\"confirmPassword\" is required"
    ])
  })

  it("dados inválidos", async () => {
    const newUser = {
      name: "user",
      email: "userteste.com",
      password: "testeteste",
      confirmPassword: "testeteste"
    }
    const response = await request(app).post("/sign-up").send(newUser)

    expect(response.status).toBe(422)
    expect(response.body).toEqual([
      "\"email\" must be a valid email"
    ])
  })

  it("senhas não correspondentes", async () => {
    const newUser = {
      name: "user",
      email: "user1@teste.com",
      password: "testeteste",
      confirmPassword: "testeteste1"
    }
    const response = await request(app).post("/sign-up").send(newUser)

    expect(response.status).toBe(422)
    expect(response.body).toEqual([
      "\"confirmPassword\" must be [ref:password]"
    ])
  })

  it("campos vazios", async () => {
    const response = await request(app).post("/sign-up").send({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    })

    expect(response.status).toBe(422)
    expect(response.body).toContain("\"name\" is not allowed to be empty")
    expect(response.body).toContain("\"email\" is not allowed to be empty")
  })

  it("senha curta", async () => {
    const response = await request(app).post("/sign-up").send({
      name: "user",
      email: "short@teste.com",
      password: "123",
      confirmPassword: "123"
    })

    expect(response.status).toBe(422)
    expect(response.body).toContain("\"password\" length must be at least 8 characters long")
  })

  it("tipos errados nos campos", async () => {
    const response = await request(app).post("/sign-up").send({
      name: 123,
      email: 456,
      password: true,
      confirmPassword: []
    })

    expect(response.status).toBe(422)
  })

  it("tentativa de injeção nos campos", async () => {
    const response = await request(app).post("/sign-up").send({
      name: "Hacker",
      email: { "$ne": "" },
      password: "password123",
      confirmPassword: "password123"
    })

    expect(response.status).toBe(422)
  })

  it("email com espaços extras", async () => {
    const newUser = {
      name: "Espaço",
      email: "   espaco@teste.com  ",
      password: "testeteste",
      confirmPassword: "testeteste"
    }
    const response = await request(app).post("/sign-up").send(newUser)
    expect(response.status).toBe(201)
  })

  it("nome com acentos e caracteres especiais", async () => {
    const response = await request(app).post("/sign-up").send({
      name: "João da Silva!@#",
      email: "joao@teste.com",
      password: "senha123",
      confirmPassword: "senha123"
    })
    expect(response.status).toBe(201)
  })
})

describe("POST /sign-in", () => {
  const validUser = {
    name: "user",
    email: "login@teste.com",
    password: "testeteste",
    confirmPassword: "testeteste"
  }

  let db

  beforeAll(async () => {
    db = getDB()
    await db.collection("users").deleteMany({ email: validUser.email }) // limpa antes
    await request(app).post("/sign-up").send(validUser)
  })

  afterAll(async () => {
    await db.collection("users").deleteMany({ email: validUser.email }) // limpa depois
  })

  it("login com dados válidos", async () => {
    const res = await request(app).post("/sign-in").send({
      email: validUser.email,
      password: validUser.password
    })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
  })

  it("login com senha incorreta", async () => {
    const response = await request(app).post("/sign-in").send({
      email: validUser.email,
      password: "senhaErrada"
    })

    expect(response.status).toBe(401)
  })

  it("login com e-mail não cadastrado", async () => {
    const response = await request(app).post("/sign-in").send({
      email: "desconhecido@teste.com",
      password: "qualquer"
    })

    expect(response.status).toBe(401)
  })

  it("campos ausentes", async () => {
    const response = await request(app).post("/sign-in").send({})

    expect(response.status).toBe(422)
    expect(response.body).toContain("\"email\" is required")
    expect(response.body).toContain("\"password\" is required")
  })

  it("email inválido", async () => {
    const response = await request(app).post("/sign-in").send({
      email: "invalido.com",
      password: "testeteste"
    })

    expect(response.status).toBe(422)
    expect(response.body).toContain("\"email\" must be a valid email")
  })

  it("campos com tipo inválido", async () => {
    const response = await request(app).post("/sign-in").send({
      email: 12345,
      password: true
    })

    expect(response.status).toBe(422)
  })
})
