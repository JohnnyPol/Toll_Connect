import { useState } from 'react';
import { useOperators } from '@/hooks/use-operators.ts';
import { Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { Input } from '@/components/ui/input.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Alert } from '@/components/ui/alert.tsx';
import { Operator } from '@/types/operators.ts';

interface OperatorSelectorProps {
	selected: string[];
	onSelectionChange: (selectedIds: string[]) => void;
}

export const OperatorList: React.FC<OperatorSelectorProps> = ({
	selected,
	onSelectionChange,
}) => {
	const { operators, loading, error } = useOperators();

	const [searchQuery, setSearchQuery] = useState('');

	const filteredOperators = operators.filter((operator: Operator) =>
		operator.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleOperatorClick = (operatorId: string) => {
		const newSelection = selected.includes(operatorId)
			? selected.filter((id) => id !== operatorId)
			: [...selected, operatorId];
		onSelectionChange(newSelection);
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <Alert variant='error'>{error}</Alert>;

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

			<ScrollArea
				className={cn(
					'w-full',
					'h-72',
					'p-4',
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

			{selected.length > 0 && (
				<div className='text-sm text-muted-foreground'>
					{selected.length} operator
					{selected.length !== 1 ? 's' : ''} selected
				</div>
			)}
		</div>
	);
};
