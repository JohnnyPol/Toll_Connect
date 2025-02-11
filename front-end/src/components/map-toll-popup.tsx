import { useEffect } from 'react';
import { Toll, TollStatistics } from '@/types/tolls.ts';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useToll } from '@/hooks/use-toll.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator.tsx';

import { useOperators } from '@/hooks/use-operators.ts';
import { PieChart } from '@/components/pie-chart.tsx';

enum PopupType {
	BASIC,
	OPERATOR_MINE,
	OPERATOR_OTHER, // = ADMIN
}

interface MapTollPopupProps {
	tollId: Toll['_id'];
	startDate: Date;
	endDate: Date;
}

export const MapTollPopup: React.FC<MapTollPopupProps> = ({
	tollId,
	startDate,
	endDate,
}) => {
	const { operators } = useOperators();
	const { toll, isLoading, error } = useToll(tollId, startDate, endDate);

	if (isLoading) {
		toast.loading('Loading toll information...', {
			id: 'toll-loading',
		});
	} else {
		setTimeout(() => {
			toast.dismiss('toll-loading');
		}, 10);
	}

	if (error) {
		toast.error('Error loading toll information: ' + error.message, {
			id: 'toll-error',
		});
	}

	useEffect(() => {
		return () => {
			toast.dismiss('toll-loading');
			toast.dismiss('toll-error');
		};
	}, []);

	if (isLoading) {
		return (
			<div className='grid gap-4 py-4 flex-1'>
				<Label htmlFor='name'>Name</Label>
				<Skeleton className='h-9 w-full' />
				<Label htmlFor='price'>Price</Label>
				<Skeleton className='h-9 w-full' />
				<Label htmlFor='road'>Road</Label>
				<Skeleton className='h-9 w-full' />
				<Label htmlFor='operator'>Operator</Label>
				<Skeleton className='h-9 w-full' />
				<Label htmlFor='avg-passes'>Average Passes</Label>
				<Skeleton className='h-9 w-full' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='p-4 text-red-500'>Failed to load toll information</div>
		);
	}

	const popupType = toll?.my_passes !== undefined
		? PopupType.OPERATOR_MINE
		: toll?.operators
		? PopupType.OPERATOR_OTHER
		: PopupType.BASIC;

	const basicComponent = (
		<div className='grid gap-4 py-4 flex-1'>
			<Label htmlFor='name'>Name</Label>
			<Input id='name' value={toll?.toll.name} disabled />
			<Label htmlFor='price'>Price</Label>
			<Input id='price' value={toll?.toll.price[1]} disabled />
			<Label htmlFor='road'>Road</Label>
			<Input id='road' value={toll?.toll.road.name} disabled />
			<Label htmlFor='operator'>Operator</Label>
			<Input
				id='operator'
				value={
					operators.find(
						(operator) => operator._id === toll?.toll.tollOperator
					)?.name || 'Unknown'
				}
				disabled
			/>
			<Label htmlFor='avg-passes'>Average Passes per Day</Label>
			<Input id='avg-passes' value={toll?.avg_passes} disabled />
			{popupType === PopupType.OPERATOR_MINE && (
				<>
					<Label htmlFor='my-passes'>My Passes</Label>
					<Input id='my-passes' value={toll?.my_passes} disabled />
				</>
			)}
		</div>
	);

	if (popupType !== PopupType.OPERATOR_OTHER) {
		return basicComponent;
	} else {
		const operatorNames = operators.map((operator) => operator.name);
		const operatorColors = operators.map((operator) =>
			operator?.chartColor || 'rgba(159, 75, 255, 0.81)'
		);
		const operatorPasses = operators.map((operator) =>
			toll?.operators?.find((pass) => pass.operator === operator._id)
				?.passes || 0
		);

		const filteredOperators = operatorPasses.filter((passes) => passes > 0);
		const filteredOperatorNames = operatorNames.filter(
			(_, index) => operatorPasses[index] > 0
		);
		const filteredOperatorColors = operatorColors.filter(
			(_, index) => operatorPasses[index] > 0
		);

		return (
			<div className='flex space-x-4 items-center'>
				{basicComponent}
				<Separator
					orientation='vertical'
					className='flex-none h-full md:block'
				/>
				<div className='flex-1'>
					<PieChart
						title='Operator Distribution'
						names={filteredOperatorNames}
						values={filteredOperators}
						colors={filteredOperatorColors}
						tooltipFormat='<b>{point.y}</b> passes ({point.percentage:.1f}%)'
					/>
				</div>
			</div>
		);
	}
};
