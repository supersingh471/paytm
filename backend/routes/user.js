const express = require("express");
const { User } = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const router = express.Router();

const signupBody = zod.object({
	username: zod.string.email(),
	password: zod.string(),
	firstname: zod.string(),
	lastname: zod.string()
});

const signinBody = zod.object({
	username: zod.string().email(),
	password: zod.string()
});

router.post("/signup", async (req, res) => {
	const { success } = signupBody.safeParse(req.body);

	if(!success) {
		return res.status(400).json({
			msg: "Email already taken/Incorrect input"
		})
	}

	const existingUser = await User.findOne({
		username: req.body.username
	})

	if(existingUser) {
		return res.status(400).json({
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

	await Account.create({
		UserId,
		balance: 1 + Math.random() * 10000
	})

	const token = jwt.sign({
		UserId
	}, JWT_SECRET);

	res.json({
		msg: "User created successfully",
		token: token
	})
})

router.post("/signin", async (req, res) => {
	const { success } = signinBody.safeParse(req.body);

	if(!success) {
		return res.status(400).json({
			msg: "Incorrect Input"
		})
	}

	const user = await User.findOne({
		username: req.body.username,
		password: req.body.password
	})

	if(user) {
		const token = jwt.sign({
			userid: user._id
		}, JWT_SECRET);
		
		res.json({
			token: token
		})

		return
	}

	res.status(400).json({
		msg: "Error while loggin in"
	})
})

//other auth routes

const updateBody = zod.object({
	password: zod.string().optional(),
	firstname: zod.string().optional(),
	lastname: zod.string().optional()
});

router.put("/", authMiddleware, async (req, res) => {
	const { success } = updateBody.safeParse(req.body);

	if(!success) {
		 return res.status(400).json({
			msg: "Invalid input"
		})
	}

	await User.updateOne(req.body, {
		_id: req.userId
	})

	res.status(200).json({
		msg: "User data updated succefully"
	})
});

//filtering route

router.get("/bulk", async (req, res) => {
	const filter = req.query.filter || "";
	const users = await User.find({
		$or: [
			{ firstname: { "$regex": filter } },
			{ lastname:  { "$regex": filter } },
		]
	});

	res.json({
		user: users.map(user => ({
			username: user.username,
			firstname: user.firstname,
			lastname: user.lastname,
			_id: user._id
		}))
	});
});

module.exports = router; 