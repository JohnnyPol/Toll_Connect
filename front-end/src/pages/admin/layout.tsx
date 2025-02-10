import * as React from 'react';
import { AppSidebar } from "@/components/admin-sidebar.tsx";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar.tsx';
import { Button } from '@/components/ui/button.tsx';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Breadcrumbs = () => {
	const { pathname } = useLocation();
	const paths = pathname.split('/').filter(Boolean);
	const breadcrumbs = paths.map((part) =>
		part.charAt(0).toUpperCase() + part.slice(1)
	);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem className='hidden md:block'>
					<BreadcrumbLink
						to={`/${paths[0]}/${paths[1]}`}
					>
						{breadcrumbs[1]}
					</BreadcrumbLink>
				</BreadcrumbItem>
				{breadcrumbs.slice(2).map((
					breadcrumb,
					index,
				) => (
					<React.Fragment key={index}>
						<BreadcrumbSeparator className='hidden md:block' />
						<BreadcrumbItem>
							<BreadcrumbPage>
								{breadcrumb}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default function AdminLayout() {
	const navigate = useNavigate();

	const signOut = async () => {
		// Check for token in localStorage
		const token = localStorage.getItem('authToken');
		// Remove the token from localStorage
		localStorage.removeItem('authToken');

		// Make a POST request to the /login API
		const response = await fetch('http://localhost:9115/api/logout', {
			method: 'POST',
			headers: {
				'X-OBSERVATORY-AUTH': token,
			},
		});

		if (response.ok) {
			// Redirect to the login page
			navigate('/login');
		} else {
			//show error message
		}
	};

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center gap-2 border-b'>
					<div className='flex items-center gap-2 px-3'>
						<SidebarTrigger />
						<Separator
							orientation='vertical'
							className='mr-2 h-4'
						/>
						<Breadcrumbs />
					</div>
					<div className='ml-auto px-3'>
						<Button
							variant='ghost'
							onClick={() => {
								signOut();
							}}
						>
							Logout
							<LogOut className='size-4' />
						</Button>
					</div>
				</header>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
