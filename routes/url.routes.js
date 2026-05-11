import express from 'express'
import {shortenPostRequestBodySchema} from '../validation/request.validation.js'

import {db} from '../db/index.js'
import {urlsTable, usersTable} from '../models/index.js'

import {nanoid} from 'nanoid'
import { urlToHttpOptions } from 'node:url'

const router = express.Router()

router.post('/shorten', async function (req, res) {

    const userID = req.user?.id 

    if(!userID) 
        return res
            .status(401)
            .json({error: 'You must be logged in to access this resource'})

    const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body)

    if(validationResult.error) {
        return res.status(400).json({error: validationResult.error})
    }

    const {url, code} = validationResult.data

    const shortCode = code ?? nanoid(6)

    const [result] = await db.insert(urlsTable).values({
        shortCode,
        target: url,
        userId: req.user.id, 
    }).returning({
        id: urlsTable.id,
        shortCode: urlsTable.shortCode,
        target: urlsTable.target
    })

    return res.status(201).json({
        id: result.id, 
        shortCode: result.shortCode, 
        target: result.target
    })

})

export default router 