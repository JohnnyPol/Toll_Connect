// src/components/Topbar.tsx
import React from "react";

const Topbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
	return (
		<div className="bg-gray-800 text-white flex items-center justify-between p-4 sticky top-0 z-10">
			<h2 className="text-lg font-bold">Dashboard</h2>
			<button
				onClick={toggleSidebar}
				className="text-gray-400 hover:text-white"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					className="h-6 w-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M4 6h16M4 12h16m-7 6h7"
					/>
				</svg>
			</button>
		</div>
	);
};

export default Topbar;
