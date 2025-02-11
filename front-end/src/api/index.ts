import Axios, { AxiosError } from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const baseURL = 'http://localhost:9115/api';

const instance = Axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Add auth token to requests if it exists
instance.interceptors.request.use((config) => {
	const token = localStorage.getItem('authToken');
	if (token) {
		config.headers['X-OBSERVATORY-AUTH'] = token;
	}
	return config;
});

// Optional: Add request/response interceptors
instance.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		// Handle errors globally
		console.error('API Error:', error.response?.data || error.message);
		return Promise.reject(error);
	},
);

// export const axios = setupCache(instance);
export const axios = instance;