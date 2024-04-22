import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./usercontext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<div className="flex flex-col justify-center items-center h-full">
			<UserProvider>
				<App />
			</UserProvider>
		</div>
	</React.StrictMode>,
);
