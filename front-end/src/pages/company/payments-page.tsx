import { useEffect, useState } from 'react';
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
import { PaymentCard } from '@/components/payment-card.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
	Avatar,
	AvatarFallback,
} from '@/components/ui/avatar.tsx';
import { ArrowLeft } from 'lucide-react';
import { Payment } from '@/types/payments.ts';
import { paymentService } from '@/api/services/payments.ts';


export default function CompanyPaymentsPage() {
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [page, setPage] = useState(1);
	const [payments, setPayments] = useState<Payment[]>([]);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		// Fetch payments when the end date changes
		if (endDate) {
			// Fetch payments
			paymentService.getPayments(
				new Date('2000-01-01'),
				endDate,
				'to be paid',
				page,
			).then((data) => {
				setTotalPages(data.pagination.totalPages);
				setPayments(data.data);
			});
		}
	}, [page, endDate]);

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
				<div className='bg-orange-100 p-4 rounded-lg flex flex-col justify-between'>
					<h2 className='text-xl font-bold mb-4 text-center'>
						Owed to Company
					</h2>
					<ScrollArea className='w-full h-[calc(100vh-18rem)]'>
						<div className='space-y-4'>
							{payments &&
								payments.map((payment: Payment) => (
									<Dialog key={payment.paymentId}>
										<DialogTrigger asChild>
											<div>
												<PaymentCard
													paymentId={payment.paymentId}
													operatorName={payment.payer}
													amount={payment.amount}
												/>
											</div>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Payment Information</DialogTitle>
												<DialogDescription>
													Here you can see information about the selected
													payment.
												</DialogDescription>
											</DialogHeader>
											<div className='mt-4 space-y-4'>
												<div className='flex items-center justify-between'>
													<div className='flex items-center space-x-3'>
														<Avatar className='h-10 w-10'>
															<AvatarFallback>
																{payment.payee.slice(0, 2).toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className='text-sm font-medium'>Payee</p>
															<p className='text-sm text-muted-foreground'>
																{payment.payee}
															</p>
														</div>
													</div>
													<ArrowLeft className='h-6 w-6 text-muted-foreground mx-2' />
													<div className='flex items-center space-x-3'>
														<div className='text-right'>
															<p className='text-sm font-medium'>Payer</p>
															<p className='text-sm text-muted-foreground'>
																{payment.payer}
															</p>
														</div>
														<Avatar className='h-10 w-10'>
															<AvatarFallback>
																{payment.payer.slice(0, 2).toUpperCase()}
															</AvatarFallback>
														</Avatar>
													</div>
												</div>
												<div className='grid grid-cols-2 gap-4'>
													<div>
														<p className='text-sm font-medium'>Payment ID</p>
														<p className='text-sm text-muted-foreground'>
															{payment.paymentId}
														</p>
													</div>
													<div className='text-right'>
														<p className='text-sm font-medium'>Amount</p>
														<p className='text-sm text-muted-foreground'>
															{payment.amount.toFixed(2)} €
														</p>
													</div>
													<div>
														<p className='text-sm font-medium'>Creation Date</p>
														<p className='text-sm text-muted-foreground'>
															{new Date(payment.creationDate)
																.toLocaleDateString()}
														</p>
													</div>
													<div className='text-right'>
														<p className='text-sm font-medium'>Payment Date</p>
														<p className='text-sm text-muted-foreground'>
															{payment.paymentDate
																? new Date(payment.paymentDate)
																	.toLocaleDateString()
																: 'N/A'}
														</p>
													</div>
													<div>
														<p className='text-sm font-medium'>
															Validation Date
														</p>
														<p className='text-sm text-muted-foreground'>
															{payment.validationDate
																? new Date(payment.validationDate)
																	.toLocaleDateString()
																: 'N/A'}
														</p>
													</div>
													<div className='text-right'>
														<p className='text-sm font-medium'>Status</p>
														<p className='text-sm text-muted-foreground'>
															{payment.status.replace(
																/\w\S*/g,
																(
																	w: string,
																) => (w.replace(/^\w/, (c) => c.toUpperCase())),
															)}
														</p>
													</div>
												</div>
												<div className='flex justify-between mt-6'>
													<Button>
														Pay
													</Button>
													<Button>
														Validate
													</Button>
												</div>
											</div>
										</DialogContent>
									</Dialog>
								))}
						</div>
					</ScrollArea>
					<Pagination className='mt-4'>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
								/>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext
									onClick={() => setPage((prev) => Math.min(prev + 1, totalPages-1))}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
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
