/** @type {import('tailwindcss').Config} */
export const content = [
	"./client/index.html",
	"./client/src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
	extend: {
		spacing: {
			'16': '4rem',
		},
	},
};
export const plugins = [];

