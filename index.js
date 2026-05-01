import express from 'express'
import { urlencoded } from 'express'

const app = express()

const PORT = process.env.PORT ?? 8000

app.use(express.json())
app.use(urlencoded({extended: true}))

app.get('/', (req, res) => {
    return res.json({status: 'Server is up and running...'})
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

