import { useEffect, useState } from 'react';
import { useOperators } from '@/hooks/use-operators.ts';
import { Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { Input } from '@/components/ui/input.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Alert } from '@/components/ui/alert.tsx';
import { Operator } from '@/types/operators.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { Label } from '@/components/ui/label.tsx';

interface OperatorSelectorProps {
	selected: Operator['_id'][];
	onSelectionChange: (selectedIds: Operator['_id'][]) => void;
}

export const OperatorList: React.FC<OperatorSelectorProps> = ({
	selected,
	onSelectionChange,
}) => {
	const { operators, loading, error } = useOperators();

	const [searchQuery, setSearchQuery] = useState('');

	const selectAll = operators.length === selected.length;

	const filteredOperators = operators.filter((operator: Operator) =>
		operator.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleOperatorClick = (operatorId: string) => {
		const newSelection = selected.includes(operatorId)
			? selected.filter((id) => id !== operatorId)
			: [...selected, operatorId];
		onSelectionChange(newSelection);
	};

	if (error) return <Alert variant='destructive'>{error}</Alert>;

	return (
		<div className='w-full space-y-2'>
			<div className='relative'>
				<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
				<Input
					placeholder='Search...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='pl-8'
				/>
			</div>
			<div className='flex h-8 items-center justify-between'>
				<Label
					className={cn(
						'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-8 w-24 text-center',
						!selectAll && 'text-primary font-bold',
					)}
				>
					Deselect All
				</Label>
				<Switch
					checked={selectAll}
					onCheckedChange={(selectAll: boolean) => {
						if (selectAll) {
							onSelectionChange(operators.map((op) => op._id));
						} else {
							onSelectionChange([]);
						}
					}}
					aria-readonly
					className='mx-4'
				/>
				<Label
					className={cn(
						'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mr-8 w-24 text-center',
						selectAll && 'text-primary font-bold',
					)}
				>
					Select All
				</Label>
			</div>
			{loading ? <Skeleton className='h-72' /> : (
				<>
					<ScrollArea
						className={cn(
							'w-full',
							'h-72',
							'pr-4',
						)}
					>
						<div className='space-y-1'>
							{filteredOperators.map((operator) => (
								<div
									key={operator._id}
									onClick={() => handleOperatorClick(operator._id)}
									className={cn(
										'flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors',
										'hover:bg-accent hover:text-accent-foreground',
										selected.includes(operator._id) &&
											'bg-accent text-accent-foreground',
									)}
								>
									<div
										className={cn(
											'w-4 h-4 border rounded-sm flex items-center justify-center',
											selected.includes(operator._id) &&
												'bg-primary border-primary',
										)}
									>
										{selected.includes(operator._id) && (
											<Check className='h-3 w-3 text-primary-foreground' />
										)}
									</div>
									<div className='flex-1'>
										<div className='text-sm font-medium'>{operator.name}</div>
									</div>
								</div>
							))}

							{filteredOperators.length === 0 && (
								<div className='p-2 text-sm text-muted-foreground text-center'>
									No operators found
								</div>
							)}
						</div>
					</ScrollArea>
				</>
			)}

			{selected.length > 0 && (
				<div className='text-sm text-muted-foreground'>
					{selected.length} operator
					{selected.length !== 1 ? 's' : ''} selected
				</div>
			)}
		</div>
	);
};
