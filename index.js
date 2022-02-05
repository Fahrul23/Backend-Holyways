require('dotenv').config()
const express = require('express')
const app = express()
const Routes = require('./src/routes/index')
const cors = require('cors')
const PORT = process.env.PORT || 5000 

app.use(express.json())
app.use(cors())

app.use('/api/v1', Routes)
app.use('/uploads', express.static('uploads'))

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
})