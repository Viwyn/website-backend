import express from "express"
const router = express.Router()

import db from "../database.js"

router.get('/', (req, res) => {
    res.status(200).render("blogs")
})


export default router