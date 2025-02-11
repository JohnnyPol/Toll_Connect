import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { GalleryVerticalEnd } from 'lucide-react';

import { LoginForm } from '@/components/login-form.tsx';
import tollImage from '@/assets/tolls.jpeg';
import { Token, UserLevel } from '@/types/auth.ts';

export default function LoginPage() {
	// Redirection of login if valid token
	const navigate = useNavigate();
	useEffect(() => {
		// Check for token in localStorage
		const token = localStorage.getItem('authToken');

		if (token) {
			try {
				// Decode the token
				console.log('Locally stored token', token);
				const decodedToken: Token = jwtDecode(token);
				{
					// Check if the token is expired
					const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
					if (decodedToken.exp < currentTime) {
						// Token is expired, remove it
						localStorage.removeItem('authToken');
					} else {
						// TODO: 1. verify token
						// if response 200 then go to the relative route /company and /admin dashboard correspondingly
					}
				}
			} catch (error) {
				console.error('Invalid token:', error);
				// Remove the invalid token
				localStorage.removeItem('authToken');
			}
		}
	}, [navigate]);
	return (
		<div className='grid min-h-svh lg:grid-cols-2'>
			<div className='flex flex-col gap-4 p-6 md:p-10'>
				<div className='flex justify-center gap-2 md:justify-start'>
					<a
						href='#'
						className='flex items-center gap-2 font-medium'
					>
						<div className='flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground'>
							<GalleryVerticalEnd className='size-4' />
						</div>
						TBD Inc.
					</a>
				</div>
				<div className='flex flex-1 items-center justify-center'>
					<div className='w-full max-w-xs'>
						<LoginForm />
					</div>
				</div>
			</div>
			<div className='relative hidden bg-muted lg:block'>
				<img
					src={tollImage}
					alt='Image'
					className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
				/>
			</div>
		</div>
	);
}
