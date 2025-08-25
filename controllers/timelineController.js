import joi from "joi"
import * as timelineService from "../services/timelineServices.js"

export async function searchVideos(req, res) {
	const { search } = req.query
	const { userId } = req

	const schema = joi.string().required().min(1)
	const validation = schema.validate(search, { abortEarly: false })

	if (validation.error) {
		return res.status(422).send(validation.error.details.map((e) => e.message))
	}

	try {
		const videos = await timelineService.searchVideos(userId, search)
		return res.status(200).json(videos)
	} catch (e) {
		console.error(e)
		return res.sendStatus(500)
	}
}

export async function getTimeline(req, res) {
	const { userId, query } = req

	try {
		const recommendations = await timelineService.getTimeline(userId, query?.newList)
		return res.status(200).json(recommendations)
	} catch (e) {
		console.error(e)
		return res.sendStatus(500)
	}
}