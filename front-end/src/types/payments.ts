export enum PaymentStatus {
	Created = 0,
	Paid = 1,
	Validated = 2,
}

export interface Payment {
	paymentId: string;
	payer: string;
	payee: string;
	creationDate: string;
	paymentDate: string | null;
	validationDate: string | null;
	amount: number;
	status: 'to be paid' | 'to be validated' | 'completed';
}
