import express from 'express'

import {db} from '../db/index.js'
import {usersTable} from '../models/index.js'

import {signupPostRequestBodySchema} from '../validation/request.validation.js'

// utils - hasing password
import { hashPasswordWithSalt} from '../utils/hash.js'

// services - existing user
import {getUserByEmail} from '../services/user.service.js'
import { createUser } from '../services/user.service.js'


const router = express.Router()

router.post('/signup',  async(req, res) => {
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body)

    if(validationResult.error) {
       return res.status(400).json({error: validationResult.error.message})
    }

    const {firstname, lastname, email, password} = validationResult.data

    const existingUser = getUserByEmail(email)

    if(existingUser) return res.status(400).json({error: `User with email ${email} already exists!`})

    // Hash the Password
    const {salt, password: hashedPassword} = hashPasswordWithSalt(password)

    const user = createUser(email, firstname, lastname, salt, password)

    return res.status(201).json({data : {userId: user.id}})

})

export default router