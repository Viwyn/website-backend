import express from "express"
const router = express.Router()

import bcrypt from "bcrypt"

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

router.get('/', (req, res) => {
    res.status(200).render("login")
})

router.post('/', async (req, res) => {
    const user = {username: req.body.username, password: req.body.password}
    res.status(201).send("Logged in as " + user.username + " with password " + user.password)
})

export default router