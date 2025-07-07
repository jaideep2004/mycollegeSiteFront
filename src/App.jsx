import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import GlobalFloatingElements from "./components/GlobalFloatingElements";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import StudentRegister from "./pages/StudentRegister";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import Department from "./pages/Department";
import CourseDetail from "./pages/CourseDetail";
import EventDetail from "./pages/EventDetail";
import DepartmentDetail from "./pages/DepartmentDetail";
import Category from "./pages/Category";
import Announcements from "./pages/Announcements";
import Events from "./pages/Events";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AnnouncementDetail from "./pages/AnnouncementDetail";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import { jwtDecode } from "jwt-decode";

const App = () => {
	const [role, setRole] = useState(localStorage.getItem("role") || null);

	// Update the useEffect to better handle token validation and persistence
	useEffect(() => {
		const checkAuth = () => {
			const token = localStorage.getItem("token");
			const storedRole = localStorage.getItem("role");

			console.log(
				"App checkAuth - token:",
				token ? "exists" : "none",
				"role:",
				storedRole
			);

			if (token && storedRole) {
				try {
					// Verify token is valid and not expired
					const decodedToken = jwtDecode(token);
					console.log("Decoded token in App:", decodedToken);
					const currentTime = Date.now() / 1000;

					if (decodedToken.exp > currentTime) {
						// Token is valid, set the role
						console.log("Valid token found, setting role to:", storedRole);
						setRole(storedRole);
					} else {
						// Token is expired, clear localStorage
						console.log("Token expired, clearing localStorage");
						localStorage.removeItem("token");
						localStorage.removeItem("role");
						setRole(null);
					}
				} catch (error) {
					// Invalid token, clear localStorage
					console.error("Invalid token:", error);
					localStorage.removeItem("token");
					localStorage.removeItem("role");
					setRole(null);
				}
			} else if (!token && storedRole) {
				// If role exists but token doesn't, clear role
				console.log("Role exists but token is missing, clearing role");
				localStorage.removeItem("role");
				setRole(null);
			} else if (token && !storedRole) {
				// If token exists but role doesn't, try to extract role from token
				try {
					const decodedToken = jwtDecode(token);
					console.log("Trying to extract role from token:", decodedToken);
					if (decodedToken.user && decodedToken.user.role) {
						console.log("Extracted role from token:", decodedToken.user.role);
						localStorage.setItem("role", decodedToken.user.role);
						setRole(decodedToken.user.role);
					} else {
						// No role in token, clear token
						console.log("No role in token, clearing token");
						localStorage.removeItem("token");
						setRole(null);
					}
				} catch (error) {
					console.error("Error extracting role from token:", error);
					localStorage.removeItem("token");
					setRole(null);
				}
			} else {
				console.log("No token or role found in localStorage");
				setRole(null);
			}
		};

		// Check auth on initial load
		checkAuth();

		// Set up an interval to periodically check token validity
		const authCheckInterval = setInterval(checkAuth, 60000); // Check every minute

		// Add event listener for storage changes (in case another tab logs out)
		const handleStorageChange = (e) => {
			if (e.key === "token" || e.key === "role") {
				checkAuth();
			}
		};
		window.addEventListener("storage", handleStorageChange);

		// Clean up
		return () => {
			clearInterval(authCheckInterval);
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				{/* Global Floating Elements that follow mouse movement across the entire site */}
				<GlobalFloatingElements />
				
				{/* ScrollToTop component to scroll to top on route change */}
				<ScrollToTop />
				
				<Navbar role={role} setRole={setRole} />
				<ToastContainer
					position='top-right'
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/about' element={<About />} />
					<Route path='/gallery' element={<Gallery />} />
					<Route path='/courses' element={<Courses />} />
					<Route path='/contact' element={<Contact />} />
					<Route path='/login' element={<Login setRole={setRole} />} />
					<Route path='/departments/:name' element={<Department />} />
					<Route path='/department/:name' element={<DepartmentDetail />} />
					<Route path='/courses/:id' element={<CourseDetail />} />
					<Route path='/events/:id' element={<EventDetail />} />
					<Route path='/events' element={<Events />} />
					<Route path='/announcements' element={<Announcements />} />
					<Route path='/announcements/:id' element={<AnnouncementDetail />} />
					<Route path='/categories/:id' element={<Category />} />
					<Route
						path='/register'
						element={<StudentRegister setRole={setRole} />}
					/>
					<Route path='/forgot-password' element={<ForgotPassword />} />
					<Route path='/reset-password' element={<ResetPassword />} />
					<Route
						path='/student'
						element={
							<PrivateRoute allowedRoles={["student"]}>
								<StudentDashboard />
							</PrivateRoute>
						}
					/>
					<Route
						path='/admin'
						element={
							<PrivateRoute allowedRoles={["admin"]}>
								<AdminDashboard />
							</PrivateRoute>
						}
					/>
					<Route
						path='/faculty'
						element={
							<PrivateRoute allowedRoles={["faculty"]}>
								<FacultyDashboard />
							</PrivateRoute>
						}
					/>
					<Route path='/news' element={<News />} />
					<Route path='/news/:id' element={<NewsDetail />} />
				</Routes>
				<Footer />
				
				{/* Scroll to top button */}
				<ScrollToTopButton />
			</Router>
		</ThemeProvider>
	);
};

export default App;
