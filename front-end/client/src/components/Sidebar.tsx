// src/components/Sidebar.tsx
import React from "react";

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
	return (
		<aside
			className={`w-64 bg-gray-600 text-white overflow-y-auto ${
				isOpen ? "block" : "hidden"
			}`}
		>
			<nav className="flex-1">
				<ul className="space-y-2">
					<li>
						<a href="#" className="block p-4 hover:bg-gray-700">
							Home
						</a>
					</li>
					<li>
						<a href="#" className="block p-4 hover:bg-gray-700">
							Profile
						</a>
					</li>
					<li>
						<a href="#" className="block p-4 hover:bg-gray-700">
							Settings
						</a>
					</li>
				</ul>
			</nav>
		</aside>
	);
};

export default Sidebar;
