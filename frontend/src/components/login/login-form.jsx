import React, { useState } from "react";
import { apiGet } from "../../api-get.js";
import { useNavigate } from "react-router-dom";
import ErrorCard from "../error.jsx";
import { useUser } from "../../usercontext.jsx";

const LoginForm = () => {
	const { getUserData } = useUser();
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState();
	const navigate = useNavigate();
	const handleLoginClick = () => {
		setErrorMessage(null);
		apiGet
			.loginUser(login, password)
			.then((res) => {
				localStorage.setItem("token", res.data.token);
				getUserData();
				navigate("/task");
			})
			.catch((error) => {
				const apiError = error.response.status;
				if (apiError === 500) {
					setErrorMessage(
						error.response.data.message.map((item) => String(item)).join("\n"),
					);
				}
				if (apiError === 401) {
					setErrorMessage("Password incorrect!");
				}
				if (apiError === 404) {
					setErrorMessage("Login not found!");
				}
			});
	};

	return (
		<>
			<div className="w-[400px] h-[400px] rounded-2xl bg-gray-300 flex flex-col gap-3 justify-around items-center relative">
				<p className="text-3xl">TODO List</p>

				<div className="flex flex-col gap-1">
					<label htmlFor="login">Login</label>
					<input
						className="border-y focus:outline-none rounded-md px-4"
						type="text"
						id="login"
						placeholder="john.doe"
						value={login}
						onChange={(event) => {
							setLogin(event.target.value.toLowerCase());
						}}
					/>
					<label htmlFor="password">Password</label>
					<input
						className="border-y focus:outline-none rounded-md px-4"
						type="password"
						id="password"
						placeholder="******"
						value={password}
						onChange={(event) => {
							setPassword(event.target.value);
						}}
					/>
				</div>
				{errorMessage && <ErrorCard error={errorMessage} />}
				<button onClick={handleLoginClick}>Login</button>
			</div>
		</>
	);
};

export default LoginForm;
