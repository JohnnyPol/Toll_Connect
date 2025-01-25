import { FilterIcon } from 'lucide-react';
import { MapFilterForm, MapFilterFormValues } from '@/components/map-filter-form.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet.tsx';

interface MapFilterSheetProps{
	defaultValues: MapFilterFormValues;
	onSubmit: (values: MapFilterFormValues) => void;
}

export const MapFilterSheet: React.FC<MapFilterSheetProps> = ({
	defaultValues,
	onSubmit
}) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<div className='pt-3'>
					<Button variant='outline'>
						<FilterIcon className='mr-2 h-4 w-4' />
						Filters
					</Button>
				</div>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>
						Filter Options
					</SheetTitle>
					<SheetDescription>
						Set your preferences for the statistics date range and the desired
						operators.
					</SheetDescription>
				</SheetHeader>
				<ScrollArea className='w-full h-[calc(100%-4rem)]'>
					<MapFilterForm
						defaultValues={defaultValues}
						onSubmit={onSubmit}
					/>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
};
