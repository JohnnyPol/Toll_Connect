import React, { createContext, useContext, useEffect, useState } from 'react';
import { Operator } from '@/types/operators.ts';
import { operatorService } from '@/api/services/operators.ts';
import { AxiosError } from 'axios';

// Define the context type
export interface OperatorContextType {
	operators: Operator[];
	loading: boolean;
	error: string | null;
}

// Create the context
export const OperatorContext = createContext<OperatorContextType | undefined>(
	undefined,
);

const AVAILABLE_MARKERS = [
	'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png',
	'http://maps.google.com/mapfiles/kml/paddle/grn-circle.png',
	'http://maps.google.com/mapfiles/kml/paddle/ltblu-circle.png',
	'http://maps.google.com/mapfiles/kml/paddle/pink-circle.png',
	'http://maps.google.com/mapfiles/kml/paddle/purple-circle.png',
	'http://maps.google.com/mapfiles/kml/paddle/red-circle.png',
	'http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png',
	'http://maps.google.com/mapfiles/kml/paddle/orange-circle.png',
];

const AVAILABLE_COLORS = [
	'#3b82f6',
	'#22c55e',
	'#0ea5e9',
	'#ec4899',
	'#a855f7',
	'#ef4444',
	'#eab308',
	'#f97316',
];

// Create the provider component
export const OperatorProvider: React.FC<{ children: React.ReactNode }> = (
	{ children },
) => {
	const [operators, setOperators] = useState<Operator[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchOperators = async (): Promise<void> => {
			try {
				setLoading(true);
				const data = await operatorService.getAll();
				data.forEach((operator, index) => {
					operator.markerIcon =
						AVAILABLE_MARKERS[index % AVAILABLE_MARKERS.length];
					operator.chartColor =
						AVAILABLE_COLORS[index % AVAILABLE_COLORS.length];
				});
				setOperators(data);
				setError(null);
			} catch (err) {
				const errorMessage = err instanceof AxiosError
					? err.response?.data?.message || err.message
					: 'An unexpected error occurred';
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchOperators();
	}, []);

	return (
		<OperatorContext.Provider value={{ operators, loading, error }}>
			{children}
		</OperatorContext.Provider>
	);
};
