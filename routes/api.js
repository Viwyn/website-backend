import express from "express"
const router = express.Router()

import axios from "axios"

import {getImage} from "../src/aws.js"

import dotenv from 'dotenv'
dotenv.config()

import { connect, query } from '../database.js';


async function getPfp(){
    const pfp_url = await getImage('pfp.png')
    return pfp_url
}

async function getExperiences() {
    try {
        await connect()

        const rows = await query(`SELECT name, startDate, endDate, description, img FROM experience`)

        return rows
    } catch (err) {
        console.error(err)
        return { error: 'Error fetching experience' }
    }
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