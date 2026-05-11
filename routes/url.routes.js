import express from 'express'
import {shortenPostRequestBodySchema} from '../validation/request.validation.js'

import {db} from '../db/index.js'
import {urlsTable, usersTable} from '../models/index.js'

import {ensureAuthenticated} from '../middlewares/auth.middleware.js'

import {nanoid} from 'nanoid'
import { urlToHttpOptions } from 'node:url'
import {eq} from 'drizzle-orm'

//services

import {addShortCodeUrls} from '../services/url.service.js'

const router = express.Router()


router.post('/shorten', ensureAuthenticated, async function (req, res) {

    const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body)

    if(validationResult.error) {
        return res.status(400).json({error: validationResult.error})
    }

    const {url, code} = validationResult.data

    const shortCode = code ?? nanoid(6)

    const userId = req.user.id

    const result = await addShortCodeUrls(url, shortCode, userId)

    return res.status(201).json({
        id: result.id, 
        shortCode: result.shortCode, 
        target: result.target
    })

})

router.get('/codes', ensureAuthenticated, async function (req, res) {
    const codes = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.userId, req.user.id))

    return res.json(codes)
})

router.get('/:shortCode', async function (req, res) {
    const code = req.params.shortCode
    const [result] = await db.select({
        target: urlsTable.target
        }).from(urlsTable).where(eq(urlsTable.shortCode, code))

        
    if(!result) {
        return res.status(401).json({error: 'Invalid URL'})
    }

    return res.redirect(result.target)
    })

export default router 