import sqlite3 from "sqlite3"

const db = new sqlite3.Database("./db.sqlite", (err) => {
		if (err) {
			console.error(err.message)
			throw err
		} else {
			console.log("Connected to database at " + new Date())
		}
	})


export default db