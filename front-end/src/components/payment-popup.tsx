import { ArrowLeft, CheckCircle, CreditCard } from 'lucide-react';
import { Payment, PaymentStatus } from '@/types/payments.ts';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useOperators } from '@/hooks/use-operators.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/api/services/payments.ts';

interface PaymentPopupProps {
	payment: Payment;
	isPayer: boolean;
	isPayee: boolean;
}

function convertStatus(status: PaymentStatus) {
	switch (status) {
		case PaymentStatus.Created:
			return 'To Be Paid';
		case PaymentStatus.Paid:
			return 'To Be Validated';
		case PaymentStatus.Validated:
			return 'Completed';
	}
}

export const PaymentPopup: React.FC<PaymentPopupProps> = (
	{ payment, isPayer, isPayee },
) => {
	const status = payment.dateofValidation
		? PaymentStatus.Validated
		: payment.dateofPayment
		? PaymentStatus.Paid
		: PaymentStatus.Created;

	const { operators } = useOperators();
	const queryClient = useQueryClient();

	const payMutation = useMutation({
		mutationFn: (id: Payment['_id']) => {
			return paymentService.payPayment(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['payments'] });
		},
	});

	const validateMutation = useMutation({
		mutationFn: (id: Payment['_id']) => {
			return paymentService.validatePayment(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['payments'] });
		}
	});

	return (
		<div className='mt-4 space-y-4'>
			<div className='grid grid-cols-[1fr,auto,1fr] items-center gap-4'>
				<div className='flex items-center space-x-3'>
					<Avatar className='h-10 w-10'>
						<AvatarFallback>
							{payment.payee.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className='text-sm font-medium'>Payee</p>
						<p className='text-sm text-muted-foreground'>
							{(operators.find((op) => op._id === payment.payee)?.name ??
								payment.payee).toLocaleUpperCase()}
						</p>
					</div>
				</div>
				<ArrowLeft className='h-6 w-6 text-muted-foreground' />
				<div className='flex items-center space-x-3 justify-end'>
					<div className='text-right'>
						<p className='text-sm font-medium'>Payer</p>
						<p className='text-sm text-muted-foreground'>
							{(operators.find((op) => op._id === payment.payer)?.name ??
								payment.payer).toLocaleUpperCase()}
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
						{payment._id}
					</p>
				</div>
				<div className='text-right'>
					<p className='text-sm font-medium'>Amount</p>
					<p className='text-sm text-muted-foreground'>
						{payment.amount.toLocaleString('el-GR', {
							style: 'currency',
							currency: 'EUR',
						})}
					</p>
				</div>
				<div>
					<p className='text-sm font-medium'>Creation Date</p>
					<p className='text-sm text-muted-foreground'>
						{new Date(payment.dateofCharge)
							.toLocaleDateString('el-GR')}
					</p>
				</div>
				<div className='text-right'>
					<p className='text-sm font-medium'>Payment Date</p>
					<p className='text-sm text-muted-foreground'>
						{payment.dateofPayment
							? new Date(payment.dateofPayment)
								.toLocaleDateString('el-GR')
							: 'N/A'}
					</p>
				</div>
				<div>
					<p className='text-sm font-medium'>
						Validation Date
					</p>
					<p className='text-sm text-muted-foreground'>
						{payment.dateofValidation
							? new Date(payment.dateofValidation)
								.toLocaleDateString('el-GR')
							: 'N/A'}
					</p>
				</div>
				<div className='text-right'>
					<p className='text-sm font-medium'>Status</p>
					<p className='text-sm text-muted-foreground'>
						{convertStatus(status)}
					</p>
				</div>
			</div>
			{(isPayer || isPayee) && ((isPayer && status === PaymentStatus.Created) ||
				(!isPayer && status === PaymentStatus.Paid)) && (
				<div className='flex justify-center mt-6'>
					{isPayer && status === PaymentStatus.Created && (
						<>
						{payMutation.isPending ? (
							<Button className='w-full' disabled>
								Paying...
							</Button>
						) : payMutation.isError ? (
							<Button className='w-full' variant="destructive" disabled>
								An error occurred: {payMutation.error.message}
							</Button>
						) : payMutation.isSuccess ? (
							<Button className='w-full' variant="success" disabled>
								Payment Successful <CheckCircle className='ml-2 h-4 w-4' />
							</Button>
						) : (
							<Button
								className='w-full'
								onClick={() => payMutation.mutate(payment._id)}
							>
								Pay <CreditCard className='ml-2 h-4 w-4' />
							</Button>
						)}
						</>
					)}
					{!isPayer && status === PaymentStatus.Paid && (
						<>
						{validateMutation.isPending ? (
							<Button className='w-full' disabled>
								Validating...
							</Button>
						) : validateMutation.isError ? (
							<Button className='w-full' variant="destructive" disabled>
								An error occurred: {validateMutation.error.message}
							</Button>
						) : validateMutation.isSuccess ? (
							<Button className='w-full' variant="success" disabled>
								Validation Successful <CheckCircle className='ml-2 h-4 w-4' />
							</Button>
						) : (
							<Button
								className='w-full'
								onClick={() => validateMutation.mutate(payment._id)}
							>
								Validate <CheckCircle className='ml-2 h-4 w-4' />
							</Button>
						)}
						</>
					)}
				</div>
			)}
		</div>
	);
};
