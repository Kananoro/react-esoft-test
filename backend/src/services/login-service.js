import { findUserByLogin, comparePassword } from "./user-service.js";
import ApiError from "../utils/error.js";
import httpStatus from "http-status";

export const loginUserWithLoginAndPassoword = async (login, password) => {
	const user = await findUserByLogin(login);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, `No user with this login`);
	}

	const isPasswordMatch = await comparePassword(password, user.password);

	if (!isPasswordMatch) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid password");
	}

	return user;
};
