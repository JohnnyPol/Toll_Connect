// src/pages/Dashboard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.tsx";
import Topbar from "../components/Topbar.tsx";

const Dashboard = () => {
	const [isSidebarOpen, setSidebarOpen] = useState(true);
	const navigate = useNavigate(); // Hook for navigation

	const toggleSidebar = () => {
		setSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className="flex flex-col h-screen">
			{/* Top Bar */}
			<Topbar toggleSidebar={toggleSidebar} />

			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<Sidebar isOpen={isSidebarOpen} />

				{/* Main content */}
				<div className="overflow-y-auto flex-1 p-8 bg-gray-100">
					<h1 className="text-3xl font-bold text-gray-800">
						Welcome to your Dashboard!
					</h1>

					<button
						onClick={() => navigate("/")}
						className="mt-4 py-2 px-4 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						Go to Login
					</button>
					<p>
						Lorem Ipsum is simply dummy text of the printing and typesetting
						industry. Lorem Ipsum has been the industry's standard dummy text
						ever since the 1500s, when an unknown printer took a galley of type
						and scrambled it to make a type specimen book. It has survived not
						only five centuries, but also the leap into electronic typesetting,
						remaining essentially unchanged. It was popularised in the 1960s
						with the release of Letraset sheets containing Lorem Ipsum passages,
						and more recently with deskwith desktop publishing software like
						Aldus PageMaker including versions of Lorem Ipsum sions of Lorem
						Ipsum ageMaker including versions of Lorem Ipsum
					</p>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
