import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";

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
} from "@/components/ui/sidebar.tsx";

import { Link } from "react-router-dom";

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			isActive: true,
			items: [
				{
					title: "Map",
					url: "/dashboard/map",
					isActive: false,
				},
				{
					title: "Statistics",
					url: "/dashboard/statistics",
					isActive: false,
				},
				{
					title: "Payments",
					url: "/dashboard/payments",
					isActive: false,
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to="/dashboard">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<GalleryVerticalEnd className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold">Toll Connect</span>
									<span className="">v420.69</span>
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
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild>
									<Link to={item.url} className="font-medium">
										{item.title}
									</Link>
								</SidebarMenuButton>
								{item.items?.length
									? (
										<SidebarMenuSub>
											{item.items.map((item) => (
												<SidebarMenuSubItem key={item.title}>
													<SidebarMenuSubButton
														asChild
														isActive={item.isActive}
													>
														<Link to={item.url}>{item.title}</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
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
