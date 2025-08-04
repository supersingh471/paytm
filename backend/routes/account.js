const router = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");

router.get("/balance", authMiddleware, async (req, res) => {
	const account = await Account.findOne({
		userId: req.userId
	})

	res.json({
		balance: account.balance
	})
});

router.post("/transfer", authMiddleware, async (req, res) => {
	const session = await mongoose.session();

	session.startTransaction();
	const { amount, to } = req.body;

	const account = await Account.findOne({userid: req.userId}).session(session);

	if (!account || account.balance < amount) {
		await session.abortTransaction();
		
		return res.status(400).json({
			msg: "Insufficient balance"
		})
	}

	const toaccount = await Account.findOne({userid: to}).session(session);

	if (!toaccount) {
		await session.abortTransaction()
		
		return res.status(400).json({
			msg: "Account doesn't exist"
		})
	}

	await Account.updateOne({userId: req.userId}, {$inc: {balance: -amount}}).session(session);
	await Account.updateOne({userid: to}, {$inc: {balance: amount}}).session(session);

	await session.commitTransaction();
	
	res.status(200).json({
		msg: "Transfer successful"
	})	
})


module.exports = router