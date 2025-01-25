import { cn } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import incognitoLogo from '@/assets/incognito.svg';
import jwtDecode from 'https://esm.sh/jwt-decode@3.1.2';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export enum UserLevel {
	Anonymous,
	Operator,
	Admin,
}

export type Token = {
	level: UserLevel;
	name: string;
	exp: number;
};

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'form'>) {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages

	// Function to handle form submission
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const email = (form.elements.namedItem('email') as HTMLInputElement).value;
		// deno-lint-ignore no-unused-vars
		const password = (form.elements.namedItem('password') as HTMLInputElement)
			.value;

		try {
			// Clear previous error messages
			setErrorMessage(null);

			// Hash the password with SHA-512
			//const passwordHash = await hashPassword(password);
			// console.log("Password Hash: ", passwordHash);
			const PasswordHash = '123456789';

			// Make a POST request to the /login API
			const response = await fetch('http://localhost:9115/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-OBSERVATORY-AUTH': 'true',
				},
				body: new URLSearchParams({
					username: email,
					password: PasswordHash,
				}).toString(),
			});

			if (!response.ok) {
				// Handle server errors
				const errorData = await response.json();
				throw new Error(errorData.message || 'Authentication failed.');
			}

			// Parse the response and decode the token
			const { token }: { token: string } = await response.json();
			const decodedToken: Token = jwtDecode(token);

			// Store the token locally
			localStorage.setItem('authToken', token);

			// Redirect based on user level
			if (decodedToken.level === UserLevel.Operator) {
				navigate('/company/dashboard');
			} else if (decodedToken.level === UserLevel.Admin) {
				navigate('/admin/dashboard');
			} else {
				throw new Error('Unknown user level.');
			}
		} catch (error) {
			setErrorMessage(
				error instanceof Error ? error.message : 'An error occurred.',
			);
		}
	};

	// Function to hash the password with SHA-512
	// deno-lint-ignore no-unused-vars
	const hashPassword = async (password: string): Promise<string> => {
		const encoder = new TextEncoder();
		const data = encoder.encode(password);
		const hashBuffer = await crypto.subtle.digest('SHA-512', data);
		return Array.from(new Uint8Array(hashBuffer))
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join('');
	};

	return (
		<form
			className={cn('flex flex-col gap-6', className)}
			{...props}
			onSubmit={handleSubmit}
		>
			<div className='flex flex-col items-center gap-2 text-center'>
				<h1 className='text-2xl font-bold'>Login to your account</h1>
				<p className='text-balance text-sm text-muted-foreground'>
					Enter your company credentials below to login to your account
				</p>
			</div>
			{/* Error message */}
			{errorMessage && (
				<div className='text-red-500 text-sm mt-2 text-center'>
					{errorMessage}
				</div>
			)}
			<div className='grid gap-6'>
				<div className='grid gap-2'>
					<Label htmlFor='email' className='text-left'>
						Email
					</Label>
					<Input id='email' type='email' placeholder='m@example.com' required />
				</div>
				<div className='grid gap-2'>
					<Label htmlFor='password' className='text-left'>
						Password
					</Label>
					<Input id='password' type='password' required />
				</div>
				<Button type='submit' className='w-full'>
					Login
				</Button>
				<div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
					<span className='relative z-10 bg-background px-2 text-muted-foreground'>
						Or
					</span>
				</div>
				<Button
					variant='outline'
					className='w-full'
					onClick={() => {
						navigate('/anonymous/map');
					}}
				>
					<img src={incognitoLogo} className='h-6 v-6' alt='Vite logo' />
					Login as guest
				</Button>
			</div>
		</form>
	);
}
