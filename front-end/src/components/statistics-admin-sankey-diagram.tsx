import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card.tsx';

export const StatisticsAdminSankeyDiagram = () => {
	return (
		<Card className='flex flex-col'>
			<CardHeader className='items-center pb-0'>
				<CardTitle>All Passes</CardTitle>
				<CardDescription>
					Passes from all Operators to all Operators
				</CardDescription>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				<h1>Sankey Diagram</h1>
			</CardContent>
		</Card>
	);
};
