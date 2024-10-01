import sqlite3 from "sqlite3";

let db;

async function connect() {
	db = new sqlite3.Database("./db.sqlite", (err) => {
		if (err) {
			console.error(err.message)
			throw err
		} else {
			console.log("Accessing database..." + new Date())
		}
	});
}

async function query(sql, ...params) {
	return new Promise((resolve, reject) => {
		db.run(sql, params, (err, rows) => {
			if (err) {
				reject(err)
			} else {
				resolve(rows)
			}
		});
	});
}

export { connect, query };
