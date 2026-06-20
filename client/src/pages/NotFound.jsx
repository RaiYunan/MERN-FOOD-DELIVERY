import { Link } from "react-router-dom";

function NotFound() {
	return (
		<div className="p-6 text-center">
			<h2 className="text-2xl font-bold">404 — Page not found</h2>
			<Link to="/" className="text-blue-600 underline">
				Go home
			</Link>
		</div>
	);
}

export default NotFound;
