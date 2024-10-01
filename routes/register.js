import express from "express"
const router = express.Router()

import bcrypt from "bcrypt"

router.get('/', (req, res) => {
    res.status(200).render("register", {username: ""})
})

router.post('/', async (req, res) => {
    try{
        const salt = await bcrypt.genSalt()
        const hashedPwd = await bcrypt.hash(req.body.password, salt)

        const user = {username: req.body.username, password: hashedPwd}

        console.log(user)

        res.status(201).redirect('/login')

    } catch (e){
        console.log(e)
        res.status(500).redirect('/register', {username: req.body.username})
    }
})

export default router