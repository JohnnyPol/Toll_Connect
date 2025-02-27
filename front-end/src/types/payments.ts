export enum PaymentStatus {
	Created = 0,
	Paid = 1,
	Validated = 2,
}

export interface Payment {
	_id: string;
	payer: string;
	payee: string;
	dateofCharge: string;
	dateofPayment: string | null;
	dateofValidation: string | null;
	amount: number;
}
