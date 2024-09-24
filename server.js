import express from "express"
const app = express()

//cors permissions
import cors from 'cors'
const corsOptions = {
    origin: ['https://viwyn.com', 'https://www.viwyn.com'],

}
app.use(cors(corsOptions))

//error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke! Oh no...')
})

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

import {default as apiRouter} from "./routes/api.js";
app.use('/api', apiRouter)

import {default as loginRouter} from "./routes/login.js";
app.use('/login', loginRouter)

app.listen(3000, () => {
    console.log('Server started on port 3000');
});