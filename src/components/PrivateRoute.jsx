import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, allowedRoles }) => {
	const token = localStorage.getItem("token");
	if (!token) return <Navigate to='/login' />;

	try {
		const decoded = jwtDecode(token);
		console.log("PrivateRoute decoded token:", decoded); // Debug log
		
		// Extract role from the correct path in the decoded token
		const userRole = decoded.user.role;
		console.log("User role:", userRole, "Allowed roles:", allowedRoles);
		
		if (!allowedRoles.includes(userRole)) {
			console.log("Access denied: role not allowed");
			return <Navigate to='/' />;
		}
		
		return children;
	} catch (err) {
		console.error("Token validation error:", err);
		localStorage.removeItem("token");
		return <Navigate to='/login' />;
	}
};

export default PrivateRoute;
