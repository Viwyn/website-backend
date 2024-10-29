import express from "express"
const router = express.Router()

import axios from "axios"

router.get('/', (req, res) => {
    if (req.user) {
        res.status(200).redirect('/user/' + req.user.username)
    } else {
        res.status(200).redirect('/login')
    }
})

router.get('/:username', (req, res) => {
    res.status(200).render('userProfile', { username:  req.params.username })
})

export default router