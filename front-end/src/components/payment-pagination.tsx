import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Pagination as PaginationComponent,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import { usePaymentColors } from '@/hooks/use-payment-color.ts';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	queryParam?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
	queryParam = 'page',
}) => {
	const [inputValue, setInputValue] = useState(currentPage.toString());
	const [isOpen, setIsOpen] = useState(false);
	const { colorScheme } = usePaymentColors();

	useEffect(() => {
		setInputValue(currentPage.toString());
	}, [currentPage]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const newPage = Number.parseInt(inputValue, 10);
		if (newPage >= 1 && newPage <= totalPages) {
			onPageChange(newPage);
			setIsOpen(false);
		} else {
			setInputValue(currentPage.toString());
		}
	};

	return (
		<PaginationComponent>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						as={Link}
						to={`?${queryParam}=${currentPage - 1}`}
						className={cn('cursor-pointer', colorScheme.color)}
						onClick={(e) => {
							e.preventDefault();
							if (currentPage > 1) onPageChange(currentPage - 1);
						}}
					/>
				</PaginationItem>
				<PaginationItem>
					<Popover open={isOpen} onOpenChange={setIsOpen}>
						<PopoverTrigger>
							<PaginationLink
								as={Link}
								to='#'
								className={cn(
									'cursor-pointer',
									colorScheme.color,
								)}
							>
								{currentPage}/{totalPages}
							</PaginationLink>
						</PopoverTrigger>
						<PopoverContent
							className={cn('w-50 p-2', colorScheme.popover)}
						>
							<form
								onSubmit={handleInputSubmit}
								className='flex items-center space-x-2'
							>
								<Input
									type='number'
									value={inputValue}
									onChange={handleInputChange}
									className='w-20 text-center bg-white'
									min={1}
									max={totalPages}
								/>
								<span>of {totalPages}</span>
								<Button
									type='submit'
									size='sm'
									className={colorScheme.button}
								>
									Go
								</Button>
							</form>
						</PopoverContent>
					</Popover>
				</PaginationItem>
				<PaginationItem>
					<PaginationNext
						as={Link}
						to={`?${queryParam}=${currentPage + 1}`}
						className={cn('cursor-pointer', colorScheme.color)}
						onClick={(e) => {
							e.preventDefault();
							if (currentPage < totalPages) onPageChange(currentPage + 1);
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</PaginationComponent>
	);
};

