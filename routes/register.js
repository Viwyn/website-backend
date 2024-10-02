import express from "express"
const router = express.Router()

import bcrypt from "bcrypt"

import db from "./../database.js"

router.get('/', (req, res) => {
    res.status(200).render("register", {username: ""})
})

router.post('/', async (req, res) => {

    try{
        const hashedPwd = await bcrypt.hash(req.body.password, 10)

        const user = {username: req.body.username, password: hashedPwd}

        const sql = `INSERT INTO user (username, password) VALUES (?, ?);`
        
        await db.run(sql, [user.username, user.password])

        res.status(201).redirect('/login')

    } catch (e){
        console.log(e)
        res.status(500).redirect('/register', {username: req.body.username})
    }
})

export default router