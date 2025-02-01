import { useEffect } from 'react';
import { Toll } from '@/types/tolls.ts';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useToll } from '../hooks/use-toll.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator.tsx';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

interface MapTollPopupProps {
	tollId: Toll['_id'];
}

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
    },
  ],
};

export const MapTollPopup: React.FC<MapTollPopupProps> = ({
	tollId,
}) => {
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

	return (
		<div className='flex space-x-4 items-center'>
			{!error && loading
				? <Skeleton className='h-72 flex-1' />
				: (
					<div className='grid gap-4 py-4 flex-1'>
						<Label htmlFor='name'>Name</Label>
						<Input id='name' value={toll.name} disabled />
						<Label htmlFor='price'>Price</Label>
						<Input id='price' value={toll.price} disabled />
						<Label htmlFor='road'>Road</Label>
						<Input id='road' value={toll.road} disabled />
						<Label htmlFor='operator'>Operator</Label>
						<Input
							id='operator'
							value={toll.operator_name}
							disabled
						/>
						<Label htmlFor='avg-passes'>Average Passes</Label>
						<Input
							id='avg-passes'
							value={toll.avg_passes}
							disabled
						/>
					</div>
				)}
			<Separator orientation='vertical' className='flex-none h-full md:block' />
			<div className='flex-1 flex flex-col justify-center items-center'>
				<h2 className='text-lg font-semibold mb-2'>Operator Distribution</h2>
				<Pie
					data={data}
				/>
			</div>
		</div>
	);
};
