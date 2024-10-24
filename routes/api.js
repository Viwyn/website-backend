import express from "express"
const router = express.Router()

import axios from "axios"

import {getImageUrl, uploadFile, getAllImageUrls} from "../src/aws.js"

import dotenv from 'dotenv'
dotenv.config()

import db from "../src/database.js"

import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

async function getImage(name){
    const pfp_url = await getImageUrl(name)
    return pfp_url
}

async function getExperiences() {
    try {
        let results = await new Promise ((resolve, reject) => {
            db.all(`SELECT name, startDate, endDate, description, img FROM experience;`, [], (err, rows) => {
                if (err) {
                    reject(err)
                }
                if (!rows) {
                    reject("No rows")
                }
                resolve(rows)
            })
        })

        return results

    } catch (err) {
        console.error(err)
        return { error: 'Error fetching experience' }
    }
}

async function getBlogs() {
    try {
        const sql = `SELECT b.id, b.title, b.content, b.author, u.pfp, b.created_at, b.updated_at FROM blogs b 
        INNER JOIN users u 
        ON u.username = b.author;`

        let results = await new Promise ((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err)
                }
                if (!rows) {
                    reject("No rows")
                }
                resolve(rows)
            })
        })
        
        const finalResult = await Promise.all(results.map(async (element) => {
            const images = await getAllImageUrls(element.id)
            if (images) {
                return { ...element, images}
            } else {
                return element
            }
        }))
        

        return finalResult

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
    const pfp = await getImage('pfp.png')
    res.status(200).json({ "url" : pfp })
})

router.get('/experience', async (req, res) => {
    try {
		const experiences = await getExperiences();
		res.status(200).json(experiences);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
})

router.get('/projects', async (req, res) => {
    try {
        console.log("fetched github repos at " + new Date())
        res.status(200).json(await getProjects())
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

router.get('/resume', (req, res) => {
    try {
        res.download('./downloads/resume.pdf')
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

router.get('/blogs', async (req, res) => {
    try {
		const blogs = await getBlogs();
		res.status(200).json(blogs);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
})

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        await uploadFile(req.file)
        .then (res.status(200).json({ status: "success" }))
        
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

export default router