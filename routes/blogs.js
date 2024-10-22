import express from "express"
const router = express.Router()

import db from "../src/database.js"

import axios from "axios"

import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

import { uploadFile } from "../src/aws.js"

router.get('/', (req, res) => {
    res.status(200).render("blogs")
})

router.get('/post/create', (req, res) => {
    if (!req.user) {
        req.session.returnTo = req.originalUrl
        return res.status(401).redirect('/login')
    } 

    res.status(200).render("blogPostCreate")
})

router.post('/post/create', upload.array('images', 10), async (req, res) => {
    const {title, content} = req.body
    const images = req.files

    const sql = `INSERT INTO blogs (title, content, author) VALUES (?, ?, ?)`

    const lastId = await new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(sql, [title, content, req.user.username], function(err) {
                if (err) { 
                    console.error(err)
                    return res.status(501).json({ error: "Internal Database Error"})
                }
                resolve(this.lastID)
            })
        })
    })

    if (images.length > 0) {
        images.forEach(async (image) => {
            try {
                await uploadFile(image, 'posts/' + lastId + '/')
                
            } catch (err) {
                console.error(err)
                return res.status(500).json({ error: "Internal Server Error" })
            }
        })
    }

    res.status(201).redirect('/blogs/post/' + lastId)
})

router.get('/post/:id', async (req, res) => {

    res.status(200).json({ status: `Loading blog id ${req.params.id}` })
})

export default router