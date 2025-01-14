import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '@/index.css';
import LoginPage from '@/pages/login/login-page.tsx';
import CompanyLayout from '@/pages/company/layout.tsx';
import CompanyDashboard from '@/pages/company/dashboard-page.tsx';
import CompanyMapPage from '@/pages/company/map-page.tsx';
import CompanyStatisticsPage from '@/pages/company/statistics-page.tsx';
import CompanyPaymentsPage from '@/pages/company/payments-page.tsx';
import AnonymousLayout from '@/pages/anonymous/layout.tsx';
import AnonymousMapPage from '@/pages/anonymous/map-page.tsx';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<LoginPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route
					path='anonymous'
					element={<AnonymousLayout />}
				>
					<Route
						path='map'
						element={<AnonymousMapPage />}
					/>
				</Route>
				<Route path='company'>
					<Route
						path='dashboard'
						element={<CompanyLayout />}
					>
						<Route
							index
							element={<CompanyDashboard />}
						/>
						<Route
							path='map'
							element={<CompanyMapPage />}
						/>
						<Route
							path='statistics'
							element={<CompanyStatisticsPage />}
						/>
						<Route
							path='payments'
							element={<CompanyPaymentsPage />}
						/>
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
