import { cn } from '@/lib/utils.ts';

const tailwindColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-lime-500",
];

const generateColors = (count: number): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(tailwindColors[i % tailwindColors.length]); // Loop over the palette if needed
  }
  return colors;
};

const ColorGrid = ({ count }: { count: number }) => {
  const colors = generateColors(count);
	console.log(colors[0]);

  return (
    <div className="grid grid-cols-4 gap-4">
      {colors.map((color, index) => (
        <div
          key={index}
          className={cn('w-16 h-16 rounded-lg', color)}
        >Hi</div>
      ))}
    </div>
  );
};

export default function StatisticsPage() {
  return <ColorGrid count={8}/>;
}
