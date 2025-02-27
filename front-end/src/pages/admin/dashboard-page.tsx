import tollImage from '@/assets/tolls.jpeg';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
	const [showMessage, setShowMessage] = useState(false);

	const handleSupportClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		setShowMessage(true);
		globalThis.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
	};

	return (
		<div className='h-full flex flex-col items-center justify-between p-8'>
			<header className='text-center'>
				<h1 className='text-4xl font-bold text-gray-800 mb-2'>
					Welcome to Toll Connect
				</h1>
				<p className='text-xl text-gray-600 italic'>Bringing people together</p>
			</header>

			<main className='flex flex-col items-center justify-center flex-grow'>
				<img
					src={tollImage}
					alt='Toll Connect Illustration'
					width={300}
					height={300}
					className='rounded-lg shadow-lg mb-8'
				/>
				<p className='text-2xl text-gray-700 text-center max-w-md'>
					Find what you're looking for in the sidebar. Your journey starts here!
				</p>
			</main>

			<footer className='text-sm text-gray-500 flex items-center gap-4'>
				<Link to='#' onClick={handleSupportClick} className='hover:underline'>
					For support click here
				</Link>
				{showMessage && (
					<span className='text-gray-600 animate-fade-in'>
						Oh well, you may have to come to our booth
					</span>
				)}
			</footer>
		</div>
	);
}
