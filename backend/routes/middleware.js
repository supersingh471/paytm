const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const authMiddleware = (req, res, next) => {
	const authHeader = req.header.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		res.status(400).json({});
	}

	const token = authHeader.splice(' ')[1];
	
	try{
		const decoded = jwt.verify(token,JWT_SECRET);
		req.userid = decoded.userid;
		next(); 
	} catch(err) {
		res.status(400).json({});
	}
};