import axios from "axios";
import { showErrorToast } from "../utils/toast";

// Create axios instance with base URL
const API = axios.create({
	baseURL: "https://mycollegesitebackend.onrender.com/api",
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
});

// Function to keep backend awake
const keepBackendAwake = () => {
	console.log("Pinging backend to keep it awake");
	axios.get("https://mycollegesitebackend.onrender.com/health")
		.then(() => console.log("Backend ping successful"))
		.catch(error => console.log("Backend ping failed, but this is okay"));
};

// Set up interval to ping every 14 minutes (840000 ms)
const pingInterval = setInterval(keepBackendAwake, 14 * 60 * 1000);

// Initial ping when app starts
keepBackendAwake();

// Clean up interval when the app unmounts
window.addEventListener("beforeunload", () => {
	clearInterval(pingInterval);
});

// Add request interceptor to include auth token
API.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}

		// Don't modify Content-Type for FormData
		if (config.data instanceof FormData) {
			// Let the browser set the Content-Type with boundary
			delete config.headers["Content-Type"];
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add response interceptor to handle errors
API.interceptors.response.use(
	(response) => response.data,
	(error) => {
		const errorMessage =
			error.response?.data?.error || error.message || "Something went wrong";
		showErrorToast(errorMessage);
		return Promise.reject(error);
	}
);

// Auth API
export const authAPI = {
	register: (userData) => API.post("/auth/register", userData),
	login: (credentials) => API.post("/auth/login", credentials),
	forgotPassword: (data) => API.post("/auth/forgot-password", data),
	resetPassword: (data) => API.post("/auth/reset-password", data),
	validateResetToken: (data) => API.post("/auth/validate-reset-token", data),
};

// Public API
export const publicAPI = {
	getAnnouncements: () => API.get("/public/announcements"),
	getNews: () => {
		console.log("Calling getNews API endpoint");
		return API.get("/public/news").then(response => {
			console.log("News API response:", response);
			return response;
		}).catch(error => {
			console.error("News API error:", error);
			throw error;
		});
	},
	getEvents: () => API.get("/public/events"),
	getEventById: (id) => API.get(`/public/events/${id}`),
	getGallery: () => API.get("/public/gallery"),
	getAboutContent: () => API.get("/public/about"),
	getTestimonials: () => API.get("/public/testimonials"),
	getContentByType: (type) => API.get(`/public/content/type/${type}`),
	getCourses: () => API.get("/public/courses"),
	getCourseById: (id) => API.get(`/public/courses/${id}`),
	getDepartments: () => API.get("/public/departments"),
	getDepartmentByName: (name) => API.get(`/public/departments/${name}`),
	getCategories: () => API.get("/public/categories"),
	getFaculty: () => API.get("/public/faculty"),
	getAdmissionInfo: () => API.get("/public/admission-info"),
	getContactInfo: () => API.get("/public/contact-info"),
};

// Student API
export const studentAPI = {
	getProfile: () => API.get("/student/profile"),
	updateProfile: (data) => API.put("/student/profile", data),
	getResults: () => API.get("/student/results"),
	getDocuments: (type) => API.get(`/student/documents/${type}`),
	getCourses: () => API.get("/student/courses"),
	getRegisteredCourses: () => API.get("/student/registered-courses"),
	createPayment: (data) => API.post("/student/payments", data),
	verifyPayment: (data) => API.post("/student/payments/verify", data),
	getPaymentHistory: () => API.get("/student/payments/history"),
	getAdmissions: () => API.get("/student/admissions"),
	applyAdmission: (data) => API.post("/student/admissions", data),
	getNotifications: () => API.get("/student/notifications"),
	markNotificationAsRead: (id) => API.put(`/student/notifications/${id}`),
};

// Admin API
export const adminAPI = {
	// Content Management
	getAllContent: (params = {}) => {
		// Convert params object to query string
		const queryParams = new URLSearchParams();
		if (params.type) queryParams.append('type', params.type);
		if (params.page) queryParams.append('page', params.page);
		if (params.limit) queryParams.append('limit', params.limit);
		if (params.search) queryParams.append('search', params.search);
		
		const queryString = queryParams.toString();
		const url = queryString ? `/admin/content?${queryString}` : '/admin/content';
		
		console.log('Fetching content with URL:', url);
		return API.get(url);
	},
	getContentByType: (type) => API.get(`/admin/content/type/${type}`),
	getContentById: (id) => API.get(`/admin/content/${id}`),
	addContent: (data) => {
		// Ensure fileUrl is always set to prevent validation errors
		const contentData = { ...data };
		if (!contentData.fileUrl) {
			contentData.fileUrl = 'https://via.placeholder.com/800x600?text=No+Image';
		}
		if (!contentData.thumbnailUrl) {
			contentData.thumbnailUrl = contentData.fileUrl;
		}
		console.log('Adding content with guaranteed fileUrl:', contentData);
		return API.post("/admin/content", contentData);
	},
	updateContent: (id, data) => {
		// Ensure fileUrl is always set for updates too
		const contentData = { ...data };
		if (!contentData.fileUrl) {
			contentData.fileUrl = 'https://via.placeholder.com/800x600?text=No+Image';
		}
		if (!contentData.thumbnailUrl) {
			contentData.thumbnailUrl = contentData.fileUrl;
		}
		console.log('Updating content with guaranteed fileUrl:', contentData);
		return API.put(`/admin/content/${id}`, contentData);
	},
	deleteContent: (id) => API.delete(`/admin/content/${id}`),

	// User Management
	getUsers: () => API.get("/admin/users"),
	getAllStudents: () => API.get("/admin/students"),
	getStudentById: (id) => API.get(`/admin/students/${id}`),
	updateStudent: (id, data) => API.put(`/admin/students/${id}`, data),
	deleteStudent: (id) => API.delete(`/admin/students/${id}`),
	getAllFaculty: () => API.get("/admin/faculty"),
	addFaculty: (data) => API.post("/admin/faculty", data),
	updateFaculty: (id, data) => API.put(`/admin/faculty/${id}`, data),
	deleteFaculty: (id) => API.delete(`/admin/faculty/${id}`),

	// Course Management
	getDepartments: () => API.get("/admin/departments"),
	addDepartment: (data) => API.post("/admin/departments", data),
	getCategories: () => API.get("/admin/categories"),
	addCategory: (data) => API.post("/admin/categories", data),
	getCourses: () => API.get("/admin/courses"),
	addCourse: (data) => API.post("/admin/courses", data),
	updateCourse: (id, data) => API.put(`/admin/courses/${id}`, data),
	deleteCourse: (id) => API.delete(`/admin/courses/${id}`),

	// Admission Management
	getAdmissions: () => API.get("/admin/admissions"),
	updateAdmission: (id, data) => API.put(`/admin/admissions/${id}`, data),

	// Result Management
	uploadResults: (formData) => API.post("/admin/results/upload", formData),
	addResult: (data) => API.post("/admin/results", data),
	getResults: (params) => {
		const queryParams = new URLSearchParams();
		if (params?.studentId) queryParams.append('studentId', params.studentId);
		if (params?.courseId) queryParams.append('courseId', params.courseId);
		if (params?.semester) queryParams.append('semester', params.semester);
		
		const queryString = queryParams.toString();
		const url = queryString ? `/admin/results?${queryString}` : '/admin/results';
		
		return API.get(url);
	},
	updateResult: (id, data) => API.put(`/admin/results/${id}`, data),
	deleteResult: (id) => API.delete(`/admin/results/${id}`),
	downloadResultTemplate: () => API.get('/admin/results/template', { responseType: 'blob' }),

	// Payment Management
	getPayments: () => API.get("/admin/payments"),

	// Notification System
	sendNotification: (data) => API.post("/admin/notifications", data),
	broadcastNotification: (data) =>
		API.post("/admin/notifications/broadcast", data),

	// File Upload
	uploadFile: (formData) => {
		console.log("Sending file upload request with FormData");
		// Don't set Content-Type header, let the browser set it with the boundary
		return API.post("/admin/upload", formData);
	},
};

// Faculty API
export const facultyAPI = {
	getProfile: () => API.get("/faculty/profile"),
	updateProfile: (data) => API.put("/faculty/profile", data),
	getStudents: () => API.get("/faculty/students"),
	getNotifications: () => API.get("/faculty/notifications"),
	uploadResults: (data) => API.post("/faculty/results/upload", data),
	uploadDocuments: (data) => API.post("/faculty/documents/upload", data),
};

export default {
	auth: authAPI,
	public: publicAPI,
	student: studentAPI,
	admin: adminAPI,
	faculty: facultyAPI,
};
