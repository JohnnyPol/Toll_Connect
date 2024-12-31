import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/login/page.tsx";
import DashboardPage from "@/pages/dashboard/page.tsx";
import MapPage from "@/pages/dashboard/map/page.tsx";
import PaymentsPage from "@/pages/dashboard/payments/page.tsx";
import StatisticsPage from "@/pages/dashboard/statistics/page.tsx";
import "@/index.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/dashboard/map" element={<MapPage />} />
				<Route path="/dashboard/payments" element={<PaymentsPage />} />
				<Route path="/dashboard/statistics" element={<StatisticsPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
