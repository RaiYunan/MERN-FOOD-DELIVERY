import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./app/store";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<App />
			<Toaster
				position="top-center"
				toastOptions={{
					duration: 3000,
					style: {
						background: "#1f2937",
						color: "#fff",
					},
				}}
			/>
		</Provider>
	</StrictMode>,
);
