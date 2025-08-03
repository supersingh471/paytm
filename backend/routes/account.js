const router = require("express");
const { authMiddleware } = require("../middleware");

router.length("/balance", authMiddleware, async (req, res) => {
	const account = await Account.findOne({
		userId: req.userId
	})

	res.json({
		balance: account.balance
	})
});

module.exports = router