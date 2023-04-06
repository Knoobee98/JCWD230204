const { validateToken } = require("../lib/jwtoken");

module.exports = {
	tokenVerify: (req, res, next) => {
		let { token } = req.headers;

		if (!token) {
			return res.status(400).send({
				isError: true,
				message: "Token not found",
				data: null,
			});
		}
		try {
			req.uid = validateToken(token);

			next()
		} catch (error) {
			res.status(400).send({
				isError: true,
				message: "Invalid Token",
				data: null,
			});
		}
	},
};
