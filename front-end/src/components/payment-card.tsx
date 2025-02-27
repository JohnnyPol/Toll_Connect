import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar.tsx';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Payment, PaymentStatus } from '@/types/payments.ts';
import { ArrowLeft } from 'lucide-react';

interface PaymentCardProps {
	payment: Payment;
}

export const PaymentCard: React.FC<PaymentCardProps> = (
	{ payment },
) => {
	const status = payment.dateofValidation
		? PaymentStatus.Validated
		: payment.dateofPayment
		? PaymentStatus.Paid
		: PaymentStatus.Created;

	return (
		<Card className='w-full hover:bg-gray-50 cursor-pointer transition-colors'>
			<CardContent className='p-4'>
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
				<div className='mt-2 flex justify-between'>
					<p className='text-xs text-muted-foreground text-left'>
						ID: {payment._id}
					</p>
					<p className='text-sm font-semibold text-right'>
						{payment.amount.toLocaleString('el-GR', {
							style: 'currency',
							currency: 'EUR',
						})}
					</p>
				</div>
			</CardContent>
		</Card>
	);
};
