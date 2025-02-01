import { useState } from 'react';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog.tsx';
import DateInput from '@/components/date-input.tsx';

const Paginator = () => {
	return (
		<Pagination className='mt-4'>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious href='#' />
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href='#'>1</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationEllipsis />
				</PaginationItem>
				<PaginationItem>
					<PaginationNext href='#' />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export default function CompanyPaymentsPage() {
	const [endDate, setEndDate] = useState<Date | null>(null);
	return (
		<>
			<div className='flex gap-4 p-4'>
				
				<DateInput
					selectedDate={endDate}
					onDateChange={setEndDate}
					placeholder='Select end date'
				/>
			</div>
			<div className='grid grid-cols-5 gap-4 h-full p-4 pt-0'>
				<div className='bg-orange-100 p-4 rounded-lg text-center flex flex-col justify-between'>
					<h2 className='text-xl font-bold mb-4'>Owed to Company</h2>
					<ScrollArea className='w-full h-[calc(100vh-18rem)]'>
						<div className='space-y-4'>
							{Array.from({ length: 50 }).map((_, index) => (
								<Dialog key={index}>
									<DialogTrigger asChild>
										<div className='bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 cursor-pointer transition-colors'>
											<h3 className='text-lg font-semibold mb-2'>
												Payment {index + 1}
											</h3>
											<p className='text-sm text-gray-500'>€100.00</p>
										</div>
									</DialogTrigger>
									<DialogContent className='w-full'>
										<DialogHeader>
											<DialogTitle>Payment Information</DialogTitle>
											<DialogDescription>
												Here you can see information about the selected payment.
											</DialogDescription>
										</DialogHeader>
										<p className='text-lg font-semibold mb-2'>
											Payment {index + 1}
										</p>
										<p className='text-sm text-gray-500'>€100.00</p>
									</DialogContent>
								</Dialog>
							))}
						</div>
					</ScrollArea>
					<Paginator />
				</div>
				<div className='bg-red-100 p-4 rounded-lg text-center'>
					<h2 className='text-xl font-bold mb-4'>Owed to Others</h2>
				</div>
				<div className='bg-blue-100 p-4 rounded-lg text-center'>
					<h2 className='text-xl font-bold mb-4'>To Validate</h2>
				</div>
				<div className='bg-purple-100 p-4 rounded-lg text-center'>
					<h2 className='text-xl font-bold mb-4'>Pending Others' Validation</h2>
				</div>
				<div className='bg-green-100 p-4 rounded-lg text-center'>
					<h2 className='text-xl font-bold mb-4'>Completed</h2>
				</div>
			</div>
		</>
	);
}
