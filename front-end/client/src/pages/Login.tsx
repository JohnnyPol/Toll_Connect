import React from "react";
import { useForm } from "npm:react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const { register, handleSubmit, formState: { errors } } = useForm();
	const navigate = useNavigate();

	const onSubmit = (data: { email: string; password: string }) => {
		// Handle form submission
		console.log(data);
	};

	const handleAnonymousLogin = () => {
		// Handle anonymous login logic
		console.log("Anonymous login");
		navigate("/dashboard");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
				<h2 className="text-center text-2xl font-bold text-gray-800">
					Sign in to your account
				</h2>
				<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email address
						</label>
						<input
							id="email"
							type="email"
							{...register("email", { required: "Email is required" })}
							className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
						{errors.email && (
							<p className="text-red-500 text-sm">{errors.email.message}</p>
						)}
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							{...register("password", { required: "Password is required" })}
							className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
						{errors.password && (
							<p className="text-red-500 text-sm">{errors.password.message}</p>
						)}
					</div>
					<button
						type="submit"
						className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						Sign In
					</button>
				</form>

				<button
					onClick={handleAnonymousLogin}
					className="w-full py-2 px-4 mt-4 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
				>
					Continue as Guest
				</button>
			</div>
		</div>
	);
};

export default Login;
