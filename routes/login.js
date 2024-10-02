import express from "express"
const router = express.Router()

import bcrypt from "bcrypt"

import dotenv from 'dotenv'
dotenv.config()

import db from "./../database.js"

router.get('/', (req, res) => {
    res.status(200).render("login")
})

router.post('/', async (req, res) => {
    let sql = `SELECT * FROM user WHERE username = ?;`

    db.get(sql, [req.body.username], async (err, row) => {
        if (err) {
            console.error(err)
            return res.status(500).send({error: "Something went wrong..."})
        }
        if (!row) {
            return res.status(404).send({error: "User does not exist"})
        }
        
        if (await bcrypt.compare(req.body.password, row.password)) {
            res.status(201).send({success: "Logged in as " + row.username})
        } else {
            res.status(401).json({error: "Password is incorrect"})
        }
    })
})

export default router