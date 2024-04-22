import {
	Link,
	RouterProvider,
	createBrowserRouter,
	redirect,
} from "react-router-dom";
import Login from "./pages/login";
import Tasks from "./pages/tasks/tasks";
import { instance } from "./api";

const protectedLoader = async (request) => {
	try {
		const isAuthorised = await instance.get("/auth/protect");
		if (isAuthorised.status !== 200) return redirect("/");
		return null;
	} catch (error) {
		return redirect("/");
	}
};

const router = createBrowserRouter([
	{
		path: "/",
		errorElement: (
			<>
				<p>Page Not Found! Error 404</p>
				<Link to={"/"}>Back</Link>
			</>
		),
		children: [
			{
				path: "",
				element: <Login />,
			},
			{
				path: "task",
				loader: protectedLoader,
				element: <Tasks />,
			},
		],
	},
]);

function App() {
	return (
		<div className="bg-blue">
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
