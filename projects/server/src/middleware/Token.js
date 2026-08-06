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

	requireRole: (roles) => {
		return (req, res, next) => {
			if (!req.uid) {
				return res.status(401).send({
					isError: true,
					message: "Unauthorized",
					data: null,
				});
			}

			const role = req.uid.status;

			if (!roles.includes(role)) {
				return res.status(403).send({
					isError: true,
					message: "Forbidden: insufficient role",
					data: null,
				});
			}

			next();
		};
	},
};
