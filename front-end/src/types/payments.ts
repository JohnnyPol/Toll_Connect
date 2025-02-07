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