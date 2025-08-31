import * as authService from "../services/authServices.js"
import joi from "joi"

export async function postSignUp(req, res) {
	// validate req.body obj
	const authSchema = joi.object({
		name: joi.string().trim().required(),
		email: joi.string().email().trim().required(),
		password: joi.string().min(8).required(),
		confirmPassword: joi.string().valid(joi.ref("password")).required()
	})
	const validation = authSchema.validate(req.body, { abortEarly: false })
	if (validation.error) {
		return res.status(422).send(validation.error.details.map((e) => e.message))
	}

	try {
		await authService.signUp(req.body)
		return res.sendStatus(201)
	} catch (e) {
		if (e.code === "EMAIL_CONFLICT") {
		return res.status(409).send({ message: "email já cadastrado" })
		}
		return res.sendStatus(500)
	} 
}

export async function postSignIn(req, res) {
	const authSchema = joi.object({
		email: joi.string().email().trim().required(),
		password: joi.string().min(8).required(),
	})

	const validation = authSchema.validate(req.body, { abortEarly: false })
	if (validation.error) {
		return res.status(422).send(validation.error.details.map((e) => e.message))
	}

	try {  // usuario aceito, retorna nome e token de acesso
		const { token, userName } = await authService.signIn(req.body)
		return res.status(200).send({ token, user_name: userName })
	} catch (e) {
		if (e.code === "INVALID_EMAIL") {
		return res.status(401).send({ message: "email não cadastrado" })
		}
		if (e.code === "INVALID_CREDENTIALS") {
		return res.status(401).send({ message: "credenciais inválidas" })
		}
		console.log(e)
		return res.sendStatus(500)
	}
}

export async function deleteAccount(req, res) {
	try {
		const { userId } = req
		if (!userId) {
			return res.status(401).send({ message: "usuário não autenticado" })
		}
	
		await authService.deleteAccount(userId)
	
		return res.sendStatus(204) // sucesso, sem conteúdo
	} catch (e) {
		if (e.code === "USER_NOT_FOUND") {
			return res.status(404).send({ message: "usuário não encontrado" })
		}
		console.error("Erro ao deletar conta:", e)
		return res.sendStatus(500)
	}
}