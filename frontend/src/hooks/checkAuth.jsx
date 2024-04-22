import { Route, Redirect } from "react-router-dom";
import { instance } from "../api-get";

const isAuthenticated = async () => {
	try {
		const answer = await instance.get("/auth/protect");
		if (answer) return false;
	} catch {
		return false;
	}
};

export const authChecker = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={async (props) => {
				const authenticated = await isAuthenticated();
				authenticated ? <Component {...props} /> : <Redirect to="/login" />;
			}}
		/>
	);
};
