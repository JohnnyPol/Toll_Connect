import { useEffect, useState } from 'react';
import { Payment, PaymentStatus } from '@/types/payments.ts';
import { PaymentCard } from '@/components/payment-card.tsx';
import { Pagination } from '@/components/payment-pagination.tsx';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { paymentService } from '@/api/services/payments.ts';
import { usePaymentColors } from '@/hooks/use-payment-color.ts';
import { cn } from '@/lib/utils.ts';
import { PaymentFilterFormValues } from '@/components/payment-filter-form.tsx';
import { PaymentPopup } from '@/components/payment-popup.tsx';

interface PaymentColumnProps {
	paymentFilterFormValues: PaymentFilterFormValues;
	title: string;
}

export const PaymentColumn: React.FC<PaymentColumnProps> = ({
	paymentFilterFormValues,
	title,
}) => {
	const { colorScheme } = usePaymentColors();

	const [currentPage, setPage] = useState(1);

	const [payments, setPayments] = useState<Payment[]>([]);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		if (paymentFilterFormValues.endDate) {
			paymentService.getPayments(
				paymentFilterFormValues,
				PaymentStatus.Created,
				true,
				currentPage
			).then((data) => {
				setTotalPages(data.pagination.totalPages);
				if (currentPage > data.pagination.totalPages) {
					setPage(1);
				}
				setPayments(data.data);
			});
		}
	}, [currentPage, paymentFilterFormValues]);

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
									<PaymentPopup
										payment={payment}
									/>
								</DialogContent>
							</Dialog>
						))}
				</div>
			</ScrollArea>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setPage}
			/>
		</div>
	);
};
