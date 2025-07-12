import db from "../db.js"
import joi from "joi"
import bcrypt from "bcrypt"
import { v4 as uuid } from 'uuid';

export async function postSignUp(req, res) {
  // validate req.body obj
  const authSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required()
  })
  const validation = authSchema.validate(req.body, { abortEarly: false })
  if (validation.error) {
    return res.status(422).send(validation.error.details.map((e) => e.message))
  }

  delete req.body.confirmPassword

  try {
    // check if email already exists
    const existEmail = await db.collection("users").findOne({ email: req.body.email })
    if (existEmail) {
      return res.sendStatus(409)
    }

    // create new document in collection
    await db.collection("users").insertOne({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10),
    })
    console.log(req.body)

    return res.sendStatus(201)
  } catch (e) {
    return res.sendStatus(500)
  }
}

export async function postSignIn (req,res) {
  const authSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  })

  const { body } = req
  try {
    const user = await db.collection('users').findOne({email: body.email})

    const validation = authSchema.validate(req.body, { abortEarly: false })
    if (validation.error) {
      return res.status(422).send(validation.error.details.map((e) => e.message))
    }

    if(bcrypt.compareSync(body.password, user.password)){
      const token = uuid();
      const session = await db.collection('sessions').findOne({'user_id': user._id})
      if(session){
          return res.status(200).send({'token': session.token})
      }else{
          await db.collection("sessions").insertOne({'user_id': user._id, 'token': token})
          return res.status(200).send({'token': token})
      }
    }
    return res.sendStatus(401)
  } catch (e) {
    console.log(e)    
    return res.sendStatus(422)  
  }
}
