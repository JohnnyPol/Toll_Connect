import { MapFilterFormValues } from '@/components/map-filter-form.tsx';

import { MapFilterSheet } from '@/components/map-filter-sheet.tsx';
import { subDays } from 'date-fns/subDays';

export default function CompanyPaymentsPage() {
	const filterFormValues = {
		startDate: subDays(new Date(), 30),
		endDate: new Date(),
		operatorIds: [],
	};
	const handleSubmit = (values: MapFilterFormValues) => {
		console.log(values);
	};

	return (
		<MapFilterSheet
			defaultValues={filterFormValues}
			onSubmit={handleSubmit}
		/>
	);
}
