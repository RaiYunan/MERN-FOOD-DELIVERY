import { Outlet } from "react-router-dom";

function MainLayout() {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="border-b px-6 py-4">
				<h1 className="text-xl font-semibold">Food Delivery</h1>
			</header>
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
}

export default MainLayout;
