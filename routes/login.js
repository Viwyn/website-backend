import express from "express"
const router = express.Router()

import bcrypt from "bcrypt"

import dotenv from 'dotenv'
dotenv.config()

import db from "../src/database.js"

import passport from "passport"

router.get('/', (req, res) => {
    res.status(200).render("login")
})

router.post('/', async (req, res, next) => {
    const returnTo = req.session.returnTo ? req.session.returnTo : '/blogs'
    delete req.session.returnTo

    passport.authenticate("local", async (err, user, info) => {
        if (err) {
            console.error("Authentication error:", err)
            return res.status(500).send({ error: "Something went wrong..." })
        }
        if (!user) {
            return res.status(401).json({ error: info.message || "Unauthorized" })
        }

        req.logIn(user, async (err) => {
            if (err) {
                console.error("Login error:", err)
                return res.status(500).send({ error: "Something went wrong during login" })
            }

            const userWithoutPassword = { username: user.username, pfp: user.pfp }
            req.session.user = userWithoutPassword
            res.status(201).send({ success: "Logged in successfully", returnTo})
        })
    })(req, res, next)
})

router.get('/auth/status', (req, res) => {
    return req.user ? res.status(200).send(req.user) : res.status(401).send({ error: "Bad credentials" })
})

export default router