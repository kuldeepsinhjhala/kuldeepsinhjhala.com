import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/home";
import AboutMe from "./pages/AboutMe";

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route>
				<Route path="/" element={<Home />}></Route>
				<Route path="/about-me" element={<AboutMe />}></Route>
			</Route>,
		),
	);
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
