import {db} from '../db/index.js'
import {urlsTable, usersTable} from '../models/index.js'


export async function addShortCodeUrls(url, shortCode, userId) {

    const [result] = await db.insert(urlsTable).values({
            shortCode,
            target: url,
            userId
        }).returning({
            id: urlsTable.id,
            shortCode: urlsTable.shortCode,
            target: urlsTable.target
        })

        return result
}