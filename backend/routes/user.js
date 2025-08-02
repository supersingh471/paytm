const express = require("express");
const { User } = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const router = express.Router();

const signupBody = zod.object({
	username: zod.string.email(),
	password: zod.string(),
	firstname: zod.string(),
	lastname: zod.string()
})

router.post("/signup", async (req, res) => {
	const { success } = signupBody.safeParse(req.body);

	if(!success) {
		return res.res.status(400).json({
			msg: "Email already taken/Incorrect input"
		})
	}

	const existingUser = await User.findOne({
		username: req.body.username
	})

	if(existingUser) {
		return res.status.(400).json({
			msg: "Email already taken/Incorrect input"
		})
	}

	const user = await User.create({
		username: req.body.username,
		password: req.body.password,
		firstname: req.body.firstname,
		lastname: req.body.lastname
	});

	const UserId = user._id;

	const token = jwt.sign({
		UserId
	}, JWT_SECRET);

	res.json({
		msg: "User created successfully",
		token: token
	})
})

module.exports = router; 