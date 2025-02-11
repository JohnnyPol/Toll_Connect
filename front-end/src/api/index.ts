import Axios, { AxiosError } from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const baseURL = 'http://localhost:9115/api';

const instance = Axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
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