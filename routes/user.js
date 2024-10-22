import express from "express"
const router = express.Router()

router.get('/', (req, res) => {
    console.log(req.user)
    res.sendStatus(200)
})


export default router