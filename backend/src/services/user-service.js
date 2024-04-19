import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";

export const findUserByLogin = async (login) => {
	const user = await prisma.user.findUnique({
		where: {
			login: login,
		},
	});
	return user;
};

export const comparePassword = async (password, hashedPassword) => {
	return await bcrypt.compare(password, hashedPassword);
};

export const hashPassword = async (password) => {
	const hashedPassword = await bcrypt.hash(password, 10);
	return hashedPassword;
};
