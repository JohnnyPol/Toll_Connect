import { cn } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import incognitoLogo from '@/assets/incognito.svg';
import { useNavigate } from 'react-router-dom';

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'form'>) {
	const navigate = useNavigate();

	return (
		<form
			className={cn('flex flex-col gap-6', className)}
			{...props}
		>
			<div className='flex flex-col items-center gap-2 text-center'>
				<h1 className='text-2xl font-bold'>
					Login to your account
				</h1>
				<p className='text-balance text-sm text-muted-foreground'>
					Enter your company credentials below to
					login to your account
				</p>
			</div>
			<div className='grid gap-6'>
				<div className='grid gap-2'>
					<Label
						htmlFor='email'
						className='text-left'
					>
						Email
					</Label>
					<Input
						id='email'
						type='email'
						placeholder='m@example.com'
						required
					/>
				</div>
				<div className='grid gap-2'>
					<Label
						htmlFor='password'
						className='text-left'
					>
						Password
					</Label>
					<Input
						id='password'
						type='password'
						required
					/>
				</div>
				<Button
					type='submit'
					className='w-full'
					onClick={() =>
						navigate('/company/dashboard')}
				>
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
					<img
						src={incognitoLogo}
						className='h-6 v-6'
						alt='Vite logo'
					/>
					Login as guest
				</Button>
			</div>
		</form>
	);
}
