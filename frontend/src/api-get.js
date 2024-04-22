import { instance } from "./api.js";

const loginUser = (login, password) => {
	return instance.post("/auth/login", {
		login: login,
		password: password,
	});
};

const getAllTasks = () => {
	return instance.get("/task");
};

const useJWT = () => {
	return instance.get("/auth/protect");
};

export const apiGet = {
	useJWT,
	loginUser,
	getAllTasks,
};
