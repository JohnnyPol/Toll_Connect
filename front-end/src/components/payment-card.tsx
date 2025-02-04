import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar.tsx';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';

interface PaymentCardProps {
	paymentId: string;
	operatorName: string;
	operatorImage?: string;
	amount: number;
}

export const PaymentCard: React.FC<PaymentCardProps> = (
	{ paymentId, operatorName, operatorImage, amount },
) => {
	return (
		<Card className='w-full hover:bg-gray-50 cursor-pointer transition-colors'>
			<CardContent className='p-4'>
				<div className='flex items-center space-x-3'>
					<Avatar className='h-8 w-8'>
						<AvatarImage src={operatorImage} alt={operatorName} />
						<AvatarFallback>
							{operatorName.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className='flex-1 overflow-hidden'>
						<p className='text-sm font-medium truncate'>{operatorName}</p>
						<p className='text-xs text-muted-foreground truncate'>
							ID: {paymentId}
						</p>
					</div>
				</div>
				<div className='mt-2 text-right'>
					<p className='text-sm font-semibold'>{amount.toFixed(2)}€</p>
				</div>
			</CardContent>
		</Card>
	);
};
