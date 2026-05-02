// in services section - you can export all the functions that do some kind of CRUD on the users level

import {db} from '../db/index.js'
import {usersTable} from '../models/index.js'

import {eq} from 'drizzle-orm'

export async function getUserByEmail(email) {

     const [existingUser] = await db
        .select({
            id: usersTable.id,
            firstname: usersTable.firstname,
            lastname: usersTable.lastname,
            email: usersTable.email
        })
        .from(usersTable)
        .where(eq(usersTable.email, email))
    
        return existingUser
}

export async function createUser(email, firstname, lastname, salt, password) {

     const [user] = await db.insert(usersTable).values({
        email,
        firstname,
        lastname,
        salt,
        password: hashedPassword
    }).returning({id: usersTable.id})

    return user
}