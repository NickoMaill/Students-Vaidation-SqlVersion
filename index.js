const express = require("express");
const app = express();
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const dotenv = require("dotenv");
dotenv.config({
	path: "./config.env",
});

app.use(express.json());

app.get("/students", async (_req, res) => {
	let students;
	try {
		students = await Postgres.query("SELECT * FROM students");
	} catch (err) {
		console.error(err);
		return res.status(400).json({
			message: "an error happened",
		});
	}

	res.json(students.rows);
});

app.post("/students", async (req, res) => {
    
	try {
		await Postgres.query("INSERT INTO students(student_name) VALUES($1)", [req.body.name]);
	} catch (err) {
		return res.status(400).json({
			message: "An error happened. Bad data received.",
		});
	}

	res.json({
		message: `Student ${req.body.name} added to the database`,
	});
});

app.listen(8000, () => {
	console.log("Listening on port 8000");
});
