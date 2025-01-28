import { useEffect } from 'react';
import { Toll } from '@/types/tolls.ts';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useToll } from '../hooks/use-toll.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { toast } from 'sonner';

interface MapAnonymousTollPopupProps {
	tollId: Toll['_id'];
}

export const MapAnonymousTollPopup: React.FC<MapAnonymousTollPopupProps> = ({
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
	}, [])

	return (
		<>
			{!error && loading ? <Skeleton className='h-72' /> : (
				<div className='grid gap-4 py-4'>
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
		</>
	);
};
