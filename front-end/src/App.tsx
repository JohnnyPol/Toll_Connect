import "@/index.css";
// @deno-types="@types/react"
import { useState } from "react";
// @ts-expect-error Unable to infer type at the moment
import reactLogo from "@/assets/react.svg";
import { Button } from "@/components/ui/button.tsx";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Button variant="outline">Button</Button>
		</>
	);
}

export default App;
