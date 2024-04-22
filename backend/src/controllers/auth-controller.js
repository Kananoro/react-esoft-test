import catchAsync from "../utils/catch-async.js";
import { loginUserWithLoginAndPassoword } from "../services/login-service.js";
import { tokenService } from "../services/token-service.js";
import { subortinateByDirectorId } from "../services/subordinate-service.js";

export const authLogin = catchAsync(async (req, res) => {
	const { login, password } = req.body;
	const user = await loginUserWithLoginAndPassoword(login, password);
	if (!user) {
		return res.status(401).json({ message: "Invalid credentials!" });
	}

	const { password: userPassword, ...userWithoutPassword } = user;
	const token = await tokenService.generateAuthToken(user);
	res.send({ token, userWithoutPassword });
});
