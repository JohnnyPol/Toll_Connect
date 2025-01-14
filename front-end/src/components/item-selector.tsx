import React from 'react';
import { Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { Input } from '@/components/ui/input.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';

interface Item {
	id: string;
	label: string;
	description?: string;
}

interface ItemSelectorProps {
	items: Item[];
	category: string;
	selectedItems: string[];
	onSelectionChange: (selectedIds: string[]) => void;
	allowMultiple?: boolean;
	searchPlaceholder?: string;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
	items,
	category = 'item',
	selectedItems,
	onSelectionChange,
	allowMultiple = true,
	searchPlaceholder = 'Search...',
}) => {
	const [searchQuery, setSearchQuery] = React.useState('');

	const filteredItems = items.filter((item) =>
		item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
		item.description?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleItemClick = (itemId: string) => {
		if (allowMultiple) {
			const newSelection = selectedItems.includes(itemId)
				? selectedItems.filter((id) => id !== itemId)
				: [...selectedItems, itemId];
			onSelectionChange(newSelection);
		} else {
			onSelectionChange([itemId]);
		}
	};

	return (
		<div className='w-full space-y-2'>
			<div className='relative'>
				<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
				<Input
					placeholder={searchPlaceholder}
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
					{filteredItems.map((item) => (
						<div
							key={item.id}
							onClick={() => handleItemClick(item.id)}
							className={cn(
								'flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors',
								'hover:bg-accent hover:text-accent-foreground',
								selectedItems.includes(item.id) &&
									'bg-accent text-accent-foreground',
							)}
						>
							<div
								className={cn(
									'w-4 h-4 border rounded-sm flex items-center justify-center',
									selectedItems.includes(item.id) &&
										'bg-primary border-primary',
								)}
							>
								{selectedItems.includes(item.id) && (
									<Check className='h-3 w-3 text-primary-foreground' />
								)}
							</div>
							<div className='flex-1'>
								<div className='text-sm font-medium'>{item.label}</div>
								{item.description && (
									<div className='text-xs text-muted-foreground'>
										{item.description}
									</div>
								)}
							</div>
						</div>
					))}

					{filteredItems.length === 0 && (
						<div className='p-2 text-sm text-muted-foreground text-center'>
							No {category}s found
						</div>
					)}
				</div>
			</ScrollArea>

			{selectedItems.length > 0 && (
				<div className='text-sm text-muted-foreground'>
					{selectedItems.length} {category}
					{selectedItems.length !== 1 ? 's' : ''} selected
				</div>
			)}
		</div>
	);
};

export default ItemSelector;
