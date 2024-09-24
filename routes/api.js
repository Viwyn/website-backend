import express from "express"
const router = express.Router()

import axios from "axios"

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

async function getProjects() {
    const res = await axios.get('https://api.github.com/users/viwyn/repos?type=public&sort=pushed&direction=desc&per_page=3&page=1', {
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': 'Bearer ' + process.env.GITHUB_API
        },
        query: {

        }
    })
    .then(response => {
        return(response.data)
    })
    .catch(error => {
        console.error(error)
    })

    return res
}

router.get('/pfp', async (req, res) => {
    const pfp = await getPfp()
    res.status(200).json(pfp)
})

router.get('/experience', async (req, res) => {
    const experiences = await getExperiences()
    res.status(200).json(experiences)
})

router.get('/projects', async (req, res) => {
    console.log("fetched github repos at " + new Date())
    res.status(200).json(await getProjects())
})

export default router