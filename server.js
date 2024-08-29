import express from "express"
const app = express()

import mysql from "mysql2"

import {getImage} from "./src/aws.js"

import dotenv from 'dotenv'
dotenv.config()

//cors permissions
import cors from 'cors'
const corsOptions ={
    origin: ['http://127.0.0.1:3001', 'https://viwyn.com', 'https://www.viwyn.com'],
    
}
app.use(cors(corsOptions))

// mysql creds
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DATABASE
}).promise()

//error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke! Oh no...')
})

async function getPfp(){
    const pfp_url = await getImage('pfp.png')
    return pfp_url
}

async function getExperiences() {
    const [experiences] = await pool.query(`
    SELECT name, startDate, endDate, description, img FROM experience;
        `)

    return experiences
}

app.get('/pfp', async (req, res) => {
    const pfp = await getPfp()
    res.status(200).json(pfp)
})

app.get('/experience', async (req, res) => {
    const experiences = await getExperiences()
    res.status(200).json(experiences)
})

app.listen(3000)