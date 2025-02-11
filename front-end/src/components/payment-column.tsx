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
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface PaymentColumnProps {
	paymentFilterFormValues: PaymentFilterFormValues;
	title: string;
	status: PaymentStatus;
	isPayer: boolean;
	isPayee: boolean;
}

export const PaymentColumn: React.FC<PaymentColumnProps> = ({
	paymentFilterFormValues,
	title,
	status,
	isPayer,
	isPayee,
}) => {
	const { colorScheme } = usePaymentColors();

	const [currentPage, setPage] = useState(1);

	const { data, isLoading, error, isSuccess } = useQuery({
		queryKey: [
			'payments',
			status,
			isPayer,
			isPayee,
			currentPage,
			paymentFilterFormValues,
		],
		queryFn: () =>
			paymentService.getPayments(
				paymentFilterFormValues,
				status,
				isPayer,
				isPayee,
				currentPage,
			),
	});

	useEffect(() => {
		setPage(1);
	}, [paymentFilterFormValues]);

	const id = status + (isPayer ? 'payer' : '') + (isPayee ? 'payee' : '');

	if (isLoading) {
		toast.loading('Loading payments...', {
			id: `loading-${id}`,
		});
	} else {
		setTimeout(() => {
			toast.dismiss(`loading-${id}`);
		}, 10);
	}

	if (error) {
		toast.error(error.message, {
			id: `error-payments-${id}`,
		});
	}

	if (isSuccess) {
		toast.success('Payments Loaded Successfully', {
			id: `success-payments-${id}`,
		});
	}

	const payments = data?.results?.map((payment) => ({
		...payment,
		dateofPayment: payment.dateofPayment === new Date(0).toISOString()
			? undefined
			: payment.dateofPayment,
		dateofValidation: payment.dateofValidation === new Date(0).toISOString()
			? undefined
			: payment.dateofValidation,
	})) as Payment[];

	const totalPages = data?.total_pages;

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
							<Dialog key={payment._id}>
								<DialogTrigger asChild>
									<div>
										<PaymentCard
											payment={payment}
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
										isPayer={isPayer}
										isPayee={isPayee}
									/>
								</DialogContent>
							</Dialog>
						))}
				</div>
			</ScrollArea>
			{!!totalPages && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			)}
		</div>
	);
};
