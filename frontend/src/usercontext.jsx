import React, { createContext, useState, useContext } from "react";
import { apiGet } from "./api-get.js";
import { instance } from "./api.js";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [subordinates, setSubordinates] = useState([]);

	const getUserData = () => {
		setIsLoading(true);
		try {
			const fetchUser = async () => {
				await apiGet.useJWT().then((res) => {
					setUser(res.data.user);
					setIsLoading(false);
				});
			};
			fetchUser();
		} catch {}
	};

	const getSubordinates = () => {
		try {
			setIsLoading(true);
			const fetchSubordinates = async () => {
				const subordinates = await instance.get("/director/subordinate");
				setSubordinates(subordinates.data);
				setIsLoading(false);
			};
			fetchSubordinates();
		} catch {}
	};

	const logoutUser = () => {
		useJWT();
		setUser(null);
	};

	return (
		<UserContext.Provider
			value={{
				user,
				getUserData,
				logoutUser,
				subordinates,
				getSubordinates,
				isLoading,
				setIsLoading,
			}}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
