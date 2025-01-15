import axios, { AxiosError } from 'axios';

const baseURL = 'http://localhost:9115/api';

export const apiClient = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Optional: Add request/response interceptors
apiClient.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		// Handle errors globally
		console.error('API Error:', error.response?.data || error.message);
		return Promise.reject(error);
	},
);
