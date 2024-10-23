import express from "express"
const app = express()
import passport from "passport"
import session from "express-session"
import "./src/strategies/local-strategy.js"

import dotenv from 'dotenv'
dotenv.config()

//set view engine
app.set('view engine', 'ejs')

 //accept json
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//cors permissions
import cors from 'cors'
const corsOptions = {
    origin: ['https://viwyn.com', 'https://www.viwyn.com'],

}
app.use(cors(corsOptions))

//sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    // proxy: true,
    cookie: {
        maxAge: 60000 * 60, //expires in 1 hour
        httpOnly: true,
        // secure: true
    }
}))

app.use(passport.initialize())
app.use(passport.session())

//error handler 
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke! Oh no...')
})

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile('index.html')
});

import {default as apiRouter} from "./routes/api.js"
app.use('/api', apiRouter)

import {default as loginRouter} from "./routes/login.js"
app.use('/login', loginRouter)

// import {default as registerRouter} from "./routes/register.js"
// app.use('/register', registerRouter)

import {default as blogsRouter} from "./routes/blogs.js"
app.use('/blogs', blogsRouter)

import {default as userRouter} from "./routes/user.js"
app.use('/user', userRouter)


app.all('*', (req, res) => {
    res.status(404).json({ error: "Endpoint is invalid"})
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
});