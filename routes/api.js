import express from "express"
const router = express.Router()

import {getImage} from "../src/aws.js"

import dotenv from 'dotenv'
dotenv.config()

import mysql from "mysql2"

// mysql creds
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DATABASE
}).promise()


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

router.get('/pfp', async (req, res) => {
    const pfp = await getPfp()
    res.status(200).json(pfp)
})

router.get('/experience', async (req, res) => {
    const experiences = await getExperiences()
    res.status(200).json(experiences)
})

export default router