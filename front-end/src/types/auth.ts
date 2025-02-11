export enum UserLevel {
	Anonymous = 0,
	Operator = 1,
	Admin = 2,
}

export type Token = {
	level: UserLevel;
	id: string;
	exp: number;
};