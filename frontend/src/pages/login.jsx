import React from "react";
import LoginForm from "../components/login/login-form";
import { Link } from "react-router-dom";

const Login = () => {
	return (
		<>
			<LoginForm />
			<Link to="/">Back</Link>
		</>
	);
};

export default Login;
