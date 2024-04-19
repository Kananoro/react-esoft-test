import { instance } from "./api-get.js";

const loginUser = (login, password) => {
	return instance.post("/login", {
		login: login,
		password: password,
	});
};

const useJWT = () => {
	return instance.get("/protected");
};

export const authApi = {
	useJWT,
	loginUser,
};
