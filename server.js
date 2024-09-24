import express from "express"
const app = express()

import fs from "fs";
import http from "http";
import https from "https";
var privateKey  = fs.readFileSync('/etc/letsencrypt/live/viwyn.com/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/viwyn.com/fullchain.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

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

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3001, 'localhost');
httpsServer.listen(3000, 'localhost');