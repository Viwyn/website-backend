import sqlite3 from "sqlite3";

async function connect() {
	const db = new sqlite3.Database("./db.sqlite", (err) => {
		if (err) {
			console.error(err.message)
			throw err
		} else {
			console.log("Accessing database..." + new Date())
		}
	});

	return db
}

export default connect;
