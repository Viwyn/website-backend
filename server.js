import express from "express"
const app = express()

//cors permissions
import cors from 'cors'
const corsOptions ={
    origin: ['http://127.0.0.1:3001', 'https://viwyn.com', 'https://www.viwyn.com'],
    
}
app.use(cors(corsOptions))

//error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke! Oh no...')
})

import router from "./routes/api.js";

app.use('/api', router)

app.listen(3000)