import { ArrowLeft } from 'lucide-react';
import { Payment } from '@/types/payments.ts';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';

interface PaymentPopupProps {
	payment: Payment;
}

export const PaymentPopup: React.FC<PaymentPopupProps> = ({ payment }) => {
	return (
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
	);
};
