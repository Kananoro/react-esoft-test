import jwt from "jsonwebtoken";
import { config } from "../config/jwt.js";

const generateAuthToken = async (
	user,
	expiresIn = "1h",
	secret = config.jwt.secret,
) => {
	const token = jwt.sign(
		{
			id: user.id,
			login: user.login,
			role: user.role,
		},
		secret,
		{
			expiresIn: expiresIn,
		},
	);
	return token;
};

export const tokenService = {
	generateAuthToken,
};
