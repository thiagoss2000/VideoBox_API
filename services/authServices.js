import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import * as userRepository from "../repositories/userRepository.js"
import * as sessionRepository from "../repositories/sessionsRepository.js"
import { setBasicPreference } from "../services/preferencesServices.js";

export async function signUp(userData) {
	const { name, email, password } = userData

	// verifica se email já existe
	const existing = await userRepository.findByEmail(email)
	if (existing) {
		throw { code: "EMAIL_CONFLICT" }
	}

	// insere usuário
	const hashedPassword = bcrypt.hashSync(password, 10)
	const userId = await userRepository.create({
		name,
		email,
		password: hashedPassword,
	})

	// cria preferencias basicas
	await setBasicPreference(userId)
}


export async function signIn({ email, password }) {
	// procura usuário
	const user = await userRepository.findByEmail(email)
	if (!user) throw { code: "INVALID_EMAIL" }

	// confere senha
	const validPassword = bcrypt.compareSync(password, user.password)
	if (!validPassword) throw { code: "INVALID_CREDENTIALS" }

	// verifica sessão existente
	let session = await sessionRepository.findByUserId(user._id)
	if (session) {
		return { token: session.token, userName: user.name }
	}

	// cria nova sessão
	const token = uuid()
	await sessionRepository.create({ userId: user._id, token })
	return { token, userName: user.name }
}

export async function validateSession(token) {
	const session = await sessionRepository.findSessionByToken(token)
	if (!session) throw { code: "UNAUTHORIZED" }
	return session
}