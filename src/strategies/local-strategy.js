import passport from 'passport'
import { Strategy } from 'passport-local'
import db from './../database.js'
import bcrypt from "bcrypt"

passport.serializeUser((user, done) => {
    done(null, user.username)
})

passport.deserializeUser((username, done) => {

    const sql = `SELECT * FROM users WHERE username = ?;`

    db.get(sql, [username], async (err, row) => {
        if (err) return done(err, null)
        if (!row) return done(null, null, { message : "User not found" })

        done(null, row)
    })
})

export default passport.use(
	new Strategy((username, password, done) => {
		const sql = `SELECT * FROM users WHERE username = ?;`

		// db.get(sql, [username], async (err, row) => {
		// 	try {
		// 		if (err) throw err;
		// 		if (!row) throw new Error("User not found");
		// 		if (!(await bcrypt.compare(password, row.password)))
		// 			throw new Error("Password is incorrect");

		// 		done(null, row);
		// 	} catch (err) {
		// 		done(err, null);
		// 	}
		// });
        db.get(sql, [username], async (err, row) => {
			if (err) return done(err, null)
			if (!row) return done(null, false, { message : "User not found" })
			if (!(await bcrypt.compare(password, row.password))) return done(null, false, { nessage : "Password is incorrect" })

			done(null, row);
		})
	})
);