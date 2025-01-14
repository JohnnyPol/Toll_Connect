import React from 'react';
import { GalleryVerticalEnd } from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from '@/components/ui/sidebar.tsx';

import { Link } from 'react-router-dom';

type SidebarItemData = {
	title: string;
	url: string;
	isActive: boolean;
};

type SidebarGroupData = {
	title: string;
	url: string;
	isActive: boolean;
	items: SidebarItemData[];
};

type SidebarData = {
	navMain: SidebarGroupData[];
};

const data: SidebarData = {
	navMain: [
		{
			title: 'Dashboard',
			url: '/company/dashboard',
			isActive: true,
			items: [
				{
					title: 'Map',
					url: '/company/dashboard/map',
					isActive: false,
				},
				{
					title: 'Statistics',
					url: '/company/dashboard/statistics',
					isActive: false,
				},
				{
					title: 'Payments',
					url: '/company/dashboard/payments',
					isActive: false,
				},
			],
		},
	],
};

function resetActive() {
	data.navMain.forEach((nav) => {
		nav.isActive = false;
		nav.items.forEach((item) => item.isActive = false);
	});
}

export function CompanySidebar(
	{ ...props }: React.ComponentProps<typeof Sidebar>,
) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size='lg'
							asChild
						>
							<Link to='/company/dashboard'>
								<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
									<GalleryVerticalEnd className='size-4' />
								</div>
								<div className='flex flex-col gap-0.5 leading-none'>
									<span className='font-semibold'>
										Toll Connect
									</span>
									<span className=''>
										v420.69
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{data.navMain.map((item) => (
							<SidebarMenuItem
								key={item.title}
							>
								<SidebarMenuButton
									asChild
									isActive={item
										.isActive}
								>
									<Link
										to={item.url}
										className='font-medium'
										onClick={() => {
											resetActive();
											item.isActive = true;
										}}
									>
										{item.title}
									</Link>
								</SidebarMenuButton>
								{item.items
										?.length
									? (
										<SidebarMenuSub>
											{item.items
												.map(
													(
														item,
													) => (
														<SidebarMenuSubItem
															key={item
																.title}
														>
															<SidebarMenuSubButton
																asChild
																isActive={item
																	.isActive}
															>
																<Link
																	to={item.url}
																	onClick={() => {
																		resetActive();
																		item.isActive = true;
																	}}
																>
																	{item.title}
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													),
												)}
										</SidebarMenuSub>
									)
									: null}
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
