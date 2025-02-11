import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/protected-route.tsx';
import { UserLevel } from '@/components/login-form.tsx';
import '@/index.css';
import LoginPage from '@/pages/login/login-page.tsx';
import CompanyLayout from '@/pages/company/layout.tsx';
import CompanyDashboard from '@/pages/company/dashboard-page.tsx';
import CompanyMapPage from '@/pages/company/map-page.tsx';
import CompanyStatisticsPage from '@/pages/company/statistics-page.tsx';
import CompanyPaymentsPage from '@/pages/company/payments-page.tsx';
import AnonymousLayout from '@/pages/anonymous/layout.tsx';
import AnonymousMapPage from '@/pages/anonymous/map-page.tsx';
import AdminLayout from '@/pages/admin/layout.tsx';
import AdminDashboard from '@/pages/admin/dashboard-page.tsx';
import AdminMapPage from '@/pages/admin/map-page.tsx';
import AdminStatisticsPage from '@/pages/admin/statistics-page.tsx';
import AdminPaymentsPage from '@/pages/admin/payments-page.tsx';
import { OperatorProvider } from '@/context/operator-context.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<OperatorProvider>
					<Routes>
						{/* Public Route */}
						<Route path='/' element={<LoginPage />} />
						<Route path='/login' element={<LoginPage />} />

						{/* Protected Routes for Company Users*/}
						{/* <Route element={<ProtectedRoute requiredLevel={UserLevel.Operator} />}> */}
						<Route path='company'>
							<Route path='dashboard' element={<CompanyLayout />}>
								<Route index element={<CompanyDashboard />} />
								<Route path='map' element={<CompanyMapPage />} />
								<Route path='statistics' element={<CompanyStatisticsPage />} />
								<Route path='payments' element={<CompanyPaymentsPage />} />
							</Route>
						</Route>
						{/* </Route> */}

						{/* Protected Routes for Admin Users */}
						{/* <Route element={<ProtectedRoute requiredLevel={UserLevel.Admin} />}> */}
							<Route path='/admin' element={<AdminLayout />}>
								<Route path='dashboard' element={<AdminDashboard />} />
								<Route path='map' element={<AdminMapPage />} />
								<Route path='statistics' element={<AdminStatisticsPage />} />
								<Route path='payments' element={<AdminPaymentsPage />} />
							</Route>
						{/* </Route> */}
						{/* Default Route */}
						<Route path='anonymous' element={<AnonymousLayout />}>
							<Route path='map' element={<AnonymousMapPage />} />
						</Route>
					</Routes>
				</OperatorProvider>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
