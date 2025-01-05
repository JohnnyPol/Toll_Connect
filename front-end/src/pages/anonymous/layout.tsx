import * as React from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.tsx';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
import { Button } from '@/components/ui/button.tsx';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

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

export default function AnonymousLayout() {
	const navigate = useNavigate();

	const logIn = () => {
		navigate('/login');
	};

	return (
		<SidebarProvider>
			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center gap-2 border-b'>
					<div className='flex items-center gap-2 px-3'>
						<Breadcrumbs />
					</div>
					<div className='ml-auto px-3'>
						<Button
							variant='ghost'
							onClick={() => {
								logIn();
							}}
						>
							Login
							<LogIn className='size-4' />
						</Button>
					</div>
				</header>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
