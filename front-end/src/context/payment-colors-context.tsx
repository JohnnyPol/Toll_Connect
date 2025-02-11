import { colors } from '../../../../../../../C:/Users/kkgio/AppData/Local/deno/npm/registry.npmjs.org/debug/4.4.0/src/browser.js';
import React, { createContext, ReactNode } from 'react';

interface ColorScheme {
	background: string;
	color: string;
	popover: string;
	button: string;
}

const colorSchemes: { [key: string]: ColorScheme } = {
	orange: {
		background: 'bg-orange-100',
		color: 'hover:bg-orange-300 active:bg-orange-400',
		popover: 'bg-orange-200',
		button: 'bg-orange-500 hover:bg-orange-600 text-white',
	},
	blue: {
		background: 'bg-blue-100',
		color: 'hover:bg-blue-300 active:bg-blue-400',
		popover: 'bg-blue-200',
		button: 'bg-blue-500 hover:bg-blue-600 text-white',
	},
	red: {
		background: 'bg-red-100',
		color: 'hover:bg-red-300 active:bg-red-400',
		popover: 'bg-red-200',
		button: 'bg-red-500 hover:bg-red-600 text-white',
	},
	green: {
		background: 'bg-green-100',
		color: 'hover:bg-green-300 active:bg-green-400',
		popover: 'bg-green-200',
		button: 'bg-green-500 hover:bg-green-600 text-white',
	},
	purple: {
		background: 'bg-purple-100',
		color: 'hover:bg-purple-300 active:bg-purple-400',
		popover: 'bg-purple-200',
		button: 'bg-purple-500 hover:bg-purple-600 text-white',
	},
};

type Color = keyof typeof colorSchemes;

export interface PaymentColorsContextType {
	colorScheme: ColorScheme;
}

export const PaymentColorsContext = createContext<
	PaymentColorsContextType | undefined
>(undefined);

interface ColorSchemeProviderProps {
	color: Color;
	children: ReactNode;
}

export const PaymentColorsProvider: React.FC<ColorSchemeProviderProps> = ({ 
	color, 
	children
}) => {
	const colorScheme = colorSchemes[color];

	return (
		<PaymentColorsContext.Provider value={{ colorScheme }}>
			{children}
		</PaymentColorsContext.Provider>
	);
};
