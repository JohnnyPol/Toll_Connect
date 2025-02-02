import { useEffect } from 'react';
import { Toll } from '@/types/tolls.ts';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useToll } from '../hooks/use-toll.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator.tsx';

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useOperators } from '@/hooks/use-operators.ts';

ChartJS.register(ArcElement, Tooltip, Legend);

enum PopupType {
	BASIC,
	OPERATOR_MINE,
	OPERATOR_OTHER, // = ADMIN
}

interface MapTollPopupProps {
	tollId: Toll['_id'];
}

export const MapTollPopup: React.FC<MapTollPopupProps> = ({
	tollId,
}) => {
	const { operators } = useOperators();
	const { toll, loading, error } = useToll(tollId);

	if (loading) {
		toast.loading('Loading toll information...', {
			id: 'toll-loading',
		});
	} else {
		setTimeout(() => {
			toast.dismiss('toll-loading');
		}, 10);
	}

	if (error) {
		toast.error('Error loading toll information: ' + error, {
			id: 'toll-error',
		});
	}

	useEffect(() => {
		return () => {
			toast.dismiss('toll-loading');
			toast.dismiss('toll-error');
		};
	}, []);

	if (loading) {
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

	const popupType = toll.my_passes
		? PopupType.OPERATOR_MINE
		: toll.other_passes
		? PopupType.OPERATOR_OTHER
		: PopupType.BASIC;

	const basicComponent = (
		<div className='grid gap-4 py-4 flex-1'>
			<Label htmlFor='name'>Name</Label>
			<Input id='name' value={toll.name} disabled />
			<Label htmlFor='price'>Price</Label>
			<Input id='price' value={toll.price} disabled />
			<Label htmlFor='road'>Road</Label>
			<Input id='road' value={toll.road} disabled />
			<Label htmlFor='operator'>Operator</Label>
			<Input id='operator' value={toll.operator_name} disabled />
			<Label htmlFor='avg-passes'>Average Passes</Label>
			<Input id='avg-passes' value={toll.avg_passes} disabled />
			{popupType === PopupType.OPERATOR_MINE && (
				<>
					<Label htmlFor='avg-passes'>My Passes</Label>
					<Input id='avg-passes' value={toll.my_passes} disabled />
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
			toll.other_passes?.find((pass) => pass.operatorId === operator._id)
				?.passes || 0
		);

		const data = {
			labels: operatorNames,
			datasets: [
				{
					label: '# of passes',
					data: operatorPasses,
					backgroundColor: operatorColors,
				},
			],
		};

		const options = {
			responsive: true,
			maintainAspectRatio: false,
		};

		return (
			<div className='flex space-x-4 items-center'>
				{basicComponent}
				<Separator
					orientation='vertical'
					className='flex-none h-full md:block'
				/>
				<div className='flex-1 flex flex-col justify-center items-center'>
					<h2 className='text-lg font-semibold mb-2 text-center'>Operator Distribution</h2>
					<div className="w-3/4">
						<Pie data={data} options={options} />
					</div>
				</div>
			</div>
		);
	}
};
