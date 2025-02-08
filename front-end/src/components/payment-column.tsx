import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Payment } from '@/types/payments.ts';
import { PaymentCard } from '@/components/payment-card.tsx';
import { Pagination } from '@/components/payment-pagination.tsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { useSearchParams } from 'react-router-dom';
import { paymentService } from '@/api/services/payments.ts';
import { usePaymentColors } from '@/hooks/use-payment-color.ts';
import { cn } from '@/lib/utils.ts';

interface PaymentColumnProps {
	endDate: Date | null;
	title: string;
	urlParam: string;
}

export const PaymentColumn: React.FC<PaymentColumnProps> = ({
	endDate,
	title,
	urlParam,
}) => {
	const { colorScheme } = usePaymentColors();

	// const [searchParams, setSearchParams] = useSearchParams();

	// const currentPage = Number(searchParams.get(urlParam)) || 1;

	const [currentPage, setPage] = useState(1);

	const [payments, setPayments] = useState<Payment[]>([]);
	const [totalPages, setTotalPages] = useState(1);

	const handlePageChange = (pageNumber: number) => {
		// setSearchParams(`${urlParam}=${pageNumber}`);
		setPage(pageNumber);
	};

	useEffect(() => {
		if (endDate) {
			paymentService.getPayments(
				new Date('2000-01-01'),
				endDate,
				'to be paid',
				currentPage,
			).then((data) => {
				setTotalPages(data.pagination.totalPages);
				if (currentPage > data.pagination.totalPages) {
					handlePageChange(1);
				}
				setPayments(data.data);
			});
		}
	}, [currentPage, endDate]);

	return (
		<div
			className={cn(
				'p-4 rounded-lg flex flex-col justify-between space-y-4',
				colorScheme.background,
			)}
		>
			<h2 className='mb-2 xl:text-xl lg:text-lg md:text-lg sm:text-sm font-bold text-center xl:h-4 lg:h-4 md:h-10 sm:h-6'>
				{title}
			</h2>
			<ScrollArea className='w-full xl:h-[calc(100vh-17rem)] lg:h-[calc(100vh-17rem)] md:h-[calc(100vh-19rem)] sm:h-[calc(100vh-18rem)]'>
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
											Here you can see information about the selected payment.
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
			{totalPages > 1 && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			)}
		</div>
	);
};
