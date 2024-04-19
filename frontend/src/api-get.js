import axios from "axios";

export const instance = axios.create({
	baseURL: "http://localhost:3000/auth",
});

instance.interceptors.request.use((config) => {
	config.headers.authorization = `Bearer ${localStorage.token}`;
	return config;
});
