import 'dotenv/config'
import express from 'express'

import {db} from '../db/index.js'
import {usersTable} from '../models/index.js'

import {signupPostRequestBodySchema, loginPostRequestBodySchema} from '../validation/request.validation.js'


// utils - hasing password
import {hashPasswordWithSalt} from '../utils/hash.js'
import {createUserToken} from '../utils/token.js'

// services - existing user
import {getUserByEmail} from '../services/user.service.js'
import { createUser } from '../services/user.service.js'

import jwt from 'jsonwebtoken'


const router = express.Router()

router.post('/signup',  async(req, res) => {
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body)

    if(validationResult.error) {
       return res.status(400).json({error: validationResult.error.message})
    }

    const {firstname, lastname, email, password} = validationResult.data

    const existingUser = await getUserByEmail(email)


    if(existingUser) return res.status(400).json({error: `User with email ${email} already exists!`})

    const user = await createUser(email, firstname, lastname, password)

    return res.status(201).json({data : {userId: user.id}})

})

router.post('/login', async (req, res) => {

    const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body)
    if(validationResult.error) {
        return res.status(400).json({error: validationResult.error.message})
    }

    const {email, password} = validationResult.data

    const user = await getUserByEmail(email)

    if(!user) {
        return res.status(404).json({error: `User with ${email} doesn't exists`})
    }

    const {password: hashedPassword} = hashPasswordWithSalt(password, user.salt)

    if(user.password != hashedPassword) {
        return res.status(400).json({error: 'Invalid Password'})
    } 

    // const token = jwt.sign({id: user.id}, process.env.JWT_SECRET)

    const token = await createUserToken({id: user.id})

    return res.json({token})


}) 

export default router