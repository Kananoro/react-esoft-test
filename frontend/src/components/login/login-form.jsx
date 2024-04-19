import React from "react";
import { authApi } from "../../api-auth.js";
import { instance } from "../../api-get.js";

const LoginForm = () => {
	const handleLoginClick = () => {
		try {
			authApi.useJWT().then((res) => {
				console.log("Успешный JWT auth", res.data);
			});
		} catch {
			authApi
				.loginUser("kananoro", "password1")
				.then((res) => {
					console.log("Успешный ответ:", res.data);
					localStorage.setItem("token", res.data.token);
				})
				.catch((error) => {
					// Обработка ошибки
					console.error("Ошибка при отправке запроса: ", error);
				});
		}
	};

	return (
		<div className="w-[400px] h-[400px] rounded-2xl bg-slate-500 flex flex-col justify-center items-center">
			<p>Login Form</p>
			<button onClick={handleLoginClick}>Login</button>
			<button
				className="hover:bg-violet-500 bg-black"
				onClick={() => {
					() => {
						console.log("Pisun");
					};
				}}>
				Login
			</button>
		</div>
	);
};

export default LoginForm;
