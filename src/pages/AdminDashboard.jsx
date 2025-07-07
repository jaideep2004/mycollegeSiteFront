import React, { useState, useEffect } from "react";
import {
	Container,
	Typography,
	Tabs,
	Tab,
	Box,
	TextField,
	Button,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Menu,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	CircularProgress,
	Grid,
	Paper,
	FormHelperText,
	Chip,
	TableHead,
	IconButton,
	Divider,
} from "@mui/material";
import api from "../services/api";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import IDCardGenerator from "../components/IDCardGenerator";
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import ResultsManagement from '../components/ResultsManagement';

const AdminDashboard = () => {
	const [tab, setTab] = useState(0);
	const [content, setContent] = useState({
		type: "",
		title: "",
		description: "",
		semester: "",
		fileUrl: "",
		thumbnailUrl: "",
		category: "",
	});
	const [users, setUsers] = useState({ students: [], faculty: [] });
	const [course, setCourse] = useState({
		name: "",
		departmentName: "",
		categoryName: "",
		feeStructure: { registrationFee: 0, fullFee: 0 },
		formUrl: "",
		image: null,
		imageUrl: "",
	});
	const [courses, setCourses] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [categories, setCategories] = useState([]);
	const [admissions, setAdmissions] = useState([]);
	const [newDept, setNewDept] = useState("");
	const [newCat, setNewCat] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const [loading, setLoading] = useState(false);
	const [uploadedFile, setUploadedFile] = useState(null);
	const [contentList, setContentList] = useState([]);
	const [contentType, setContentType] = useState('all');
	const [contentPage, setContentPage] = useState(1);
	const [contentLoading, setContentLoading] = useState(false);
	const [contentPagination, setContentPagination] = useState({
		total: 0,
		page: 1,
		limit: 10,
		pages: 0
	});
	const [testimonials, setTestimonials] = useState([]);
	const [testimonialForm, setTestimonialForm] = useState({
		title: "",
		description: "",
		thumbnailUrl: "",
	});
	const [editingTestimonialId, setEditingTestimonialId] = useState(null);
	const [editingContent, setEditingContent] = useState(null);
	const [contentForm, setContentForm] = useState({
		type: '',
		title: '',
		description: '',
		category: '',
		file: null,
		filePreview: null,
		courseId: '',
	});
	const [payments, setPayments] = useState([]);
	const [editingCourse, setEditingCourse] = useState(null);
	const [galleryCategories, setGalleryCategories] = useState([]);
	const [selectedGalleryCategory, setSelectedGalleryCategory] = useState("");
	const [refreshTrigger, setRefreshTrigger] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				if (tab === 0) {
					// Fetch all content or filtered by type
					const response = await (contentType === 'all' 
						? api.admin.getAllContent()
						: api.admin.getContentByType(contentType));
					setContentList(response || []);
					
					// Fetch gallery categories using the new type
					try {
						console.log('Fetching gallery categories');
						const galleryCategories = await api.admin.getContentByType('gallery-category');
						console.log('Gallery categories response:', galleryCategories);
						
						const categories = galleryCategories?.data || galleryCategories || [];
						console.log('Processed gallery categories:', categories);
						setGalleryCategories(categories);
					} catch (error) {
						console.error('Error fetching gallery categories:', error);
						setGalleryCategories([]);
					}
				} else if (tab === 1) {
					// Fetch students and faculty separately
					try {
						const studentsRes = await api.admin.getAllStudents();
						const facultyRes = await api.admin.getAllFaculty();
						
						console.log('Raw students response:', studentsRes);
						
						// Extract data from response
						const students = studentsRes?.data || studentsRes || [];
						const faculty = facultyRes?.data || facultyRes || [];
						
						console.log('Processed students:', students);
						console.log('Processed faculty:', faculty);
						
						setUsers({
							students: students,
							faculty: faculty
						});
					} catch (error) {
						console.error('Error fetching users:', error);
						setUsers({ students: [], faculty: [] });
					}
				} else if (tab === 2) {
					const [coursesRes, departmentsRes, categoriesRes] = await Promise.all([
						api.admin.getCourses(),
						api.admin.getDepartments(),
						api.admin.getCategories(),
					]);
					
					console.log('Raw departments response:', departmentsRes);
					console.log('Raw categories response:', categoriesRes);
					
					// Extract data from responses
					const courses = coursesRes?.data || coursesRes || [];
					const departments = departmentsRes?.data || departmentsRes || [];
					const categories = categoriesRes?.data || categoriesRes || [];
					
					console.log('Processed courses:', courses);
					console.log('Processed departments:', departments);
					console.log('Processed categories:', categories);
					
					setCourses(courses);
					setDepartments(departments);
					setCategories(categories);
				} else if (tab === 3) {
					try {
						const response = await api.admin.getAdmissions();
						console.log('Raw admissions response:', response);
						
						// Extract data from response
						const admissionsData = response?.data || response || [];
						console.log('Processed admissions:', admissionsData);
						
						setAdmissions(admissionsData);
					} catch (error) {
						console.error('Error fetching admissions:', error);
						setAdmissions([]);
						showErrorToast("Failed to fetch admissions data");
					}
				} else if (tab === 4) {
					// Fetch testimonials using 'testimonial' type instead of 'about'
					const response = await api.admin.getContentByType('testimonial');
					setTestimonials(response || []);
				} else if (tab === 5) {
					// Fetch payments
					try {
						// Try to fetch from API
						const response = await api.admin.getPayments();
						const payments = response?.data || response || [];
						console.log('Payments data from API:', payments);
						setPayments(payments);
					} catch (error) {
						console.error("Error fetching payments:", error);
						// Show error but don't use mock data
						setPayments([]);
						showErrorToast("Failed to fetch payment data. Please check if the API endpoint is available.");
					}
				} else if (tab === 6) {
					// For ID Card Generator tab, we need both students and departments/courses
					try {
						const [studentsRes, coursesRes, departmentsRes] = await Promise.all([
							api.admin.getAllStudents(),
							api.admin.getCourses(),
							api.admin.getDepartments()
						]);
						
						const students = studentsRes?.data || studentsRes || [];
						const courses = coursesRes?.data || coursesRes || [];
						const departments = departmentsRes?.data || departmentsRes || [];
						
						setUsers(prev => ({
							...prev,
							students: students
						}));
						setCourses(courses);
						setDepartments(departments);
					} catch (error) {
						console.error('Error fetching data for ID Card Generator:', error);
						showErrorToast("Failed to fetch required data for ID cards");
					}
				} else if (tab === 7) {
					// For Results tab, we need students and courses
					try {
						const [studentsRes, coursesRes] = await Promise.all([
							api.admin.getAllStudents(),
							api.admin.getCourses()
						]);
						
						const students = studentsRes?.data || studentsRes || [];
						const courses = coursesRes?.data || coursesRes || [];
						
						setUsers(prev => ({
							...prev,
							students: students
						}));
						setCourses(courses);
					} catch (error) {
						console.error('Error fetching data for Results:', error);
						showErrorToast("Failed to fetch required data for Results");
					}
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				if (tab === 0) {
					setContentList([]);
					setGalleryCategories([]);
				} else if (tab === 1) {
					setUsers({ students: [], faculty: [] });
				} else if (tab === 2) {
					setCourses([]);
					setDepartments([]);
					setCategories([]);
				} else if (tab === 3) {
					setAdmissions([]);
				} else if (tab === 4) {
					setTestimonials([]);
				} else if (tab === 5) {
					// Use mock data as fallback
					setPayments([]);
				} else if (tab === 7) {
					// Use mock data as fallback
					setUsers({ students: [], faculty: [] });
					setCourses([]);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [tab, contentType]);

	useEffect(() => {
		if (tab === 0) {
			fetchContent();
		}
	}, [tab, contentType, contentPage]);

	useEffect(() => {
		if (tab === 0) {
			// When refreshTrigger changes, force fetch new content
			fetchContent();
		}
	}, [refreshTrigger]);

	const fetchContent = async () => {
		setContentLoading(true);
		try {
			console.log('Fetching content for type:', contentType, 'page:', contentPage);
			
			// Always use getAllContent with parameters instead of switching between APIs
			const response = await api.admin.getAllContent({
				type: contentType !== 'all' ? contentType : undefined,
				page: contentPage,
				limit: 10
			});
			
			console.log('Fetch content response:', response);
			
			// Handle different response formats
			let contentData = [];
			let paginationData = {
				total: 0,
				page: parseInt(contentPage),
				limit: 10,
				pages: 0
			};
			
			// Extract data from response based on format
			if (response?.data && Array.isArray(response.data)) {
				contentData = response.data;
			} else if (Array.isArray(response)) {
				contentData = response;
			} else if (response?.data && !Array.isArray(response.data)) {
				contentData = Array.isArray(response.data) ? response.data : [response.data];
			}
			
			// Extract pagination data if available
			if (response?.pagination) {
				paginationData = {
					...paginationData,
					...response.pagination
				};
			}
			
			console.log('Processed content data:', contentData);
			console.log('Processed pagination data:', paginationData);
			
			setContentList(contentData || []);
			setContentPagination(paginationData);
		} catch (error) {
			console.error('Error fetching content:', error);
			// Error is already handled by the API interceptor
			setContentList([]);
			setContentPagination({
				total: 0,
				page: parseInt(contentPage),
				limit: 10,
				pages: 0
			});
		} finally {
			setContentLoading(false);
		}
	};

	const handleAddContent = async () => {
		if (!contentForm.type || !contentForm.title) {
			showErrorToast("Content type and title are required");
			return;
		}

		setLoading(true);
		try {
			// For gallery items, validate category selection
			if (contentForm.type === 'gallery') {
				if (!selectedGalleryCategory) {
					showErrorToast("Please select a gallery category");
					setLoading(false);
					return;
				}
			}
			
			// First upload the file if there is one
			let fileUrl = '';
			let thumbnailUrl = '';
			
			if (contentForm.file) {
				const formData = new FormData();
				formData.append('file', contentForm.file);
				formData.append('type', contentForm.type);
				
				try {
					console.log('Uploading content file...');
					const response = await api.admin.uploadFile(formData);
					console.log('File upload response:', response);
					if (response.success) {
						fileUrl = response.data.fileUrl;
						thumbnailUrl = response.data.fileUrl;
					} else {
						fileUrl = 'https://via.placeholder.com/800x600?text=No+Image';
						thumbnailUrl = fileUrl;
					}
				} catch (error) {
					console.error('Error uploading file:', error);
					fileUrl = 'https://via.placeholder.com/800x600?text=No+Image';
					thumbnailUrl = fileUrl;
				}
			} else {
				fileUrl = 'https://via.placeholder.com/800x600?text=No+Image';
				thumbnailUrl = fileUrl;
			}
			
			// Get category info if this is a gallery item
			let categoryId = null;
			let categoryName = '';
			if (contentForm.type === 'gallery' && selectedGalleryCategory) {
				const category = galleryCategories.find(cat => cat._id === selectedGalleryCategory);
				if (category) {
					categoryId = category._id;
					categoryName = category.title;
				}
			}
			
			// Prepare content data based on type
			const contentData = {
				type: contentForm.type, // Use the actual type (gallery or gallery-category)
				title: contentForm.title,
				description: contentForm.description || '',
				fileUrl: fileUrl,
				thumbnailUrl: thumbnailUrl,
				courseId: contentForm.courseId || undefined,
			};

			// Add category reference for gallery items
			if (contentForm.type === 'gallery' && categoryId) {
				contentData.category = categoryId;
				contentData.categoryName = categoryName;
			}
			
			console.log('Adding content with data:', contentData);
			
			// Add the content
			const addResponse = await api.admin.addContent(contentData);
			console.log('Content add response:', addResponse);
			
			showSuccessToast("Content added successfully");
			
			// Reset form
			setContentForm({
				type: "",
				title: "",
				description: "",
				category: "",
				file: null,
				filePreview: null,
				courseId: '',
			});
			setSelectedGalleryCategory("");
			
			// Force refresh content list
			setRefreshTrigger(prev => prev + 1);
			
			// Refresh gallery categories if needed
			if (contentForm.type === 'gallery-category' || contentForm.type === 'gallery') {
				const galleryResponse = await api.admin.getContentByType('gallery-category');
				const categories = galleryResponse?.data || galleryResponse || [];
				setGalleryCategories(categories);
			}
			
		} catch (error) {
			console.error('Error adding content:', error);
			showErrorToast('Failed to add content: ' + (error.response?.data?.error || error.message));
		} finally {
			setLoading(false);
		}
	};

	const handleAddCourse = async () => {
		// Validate required fields
		if (!course.name || !course.departmentName || !course.categoryName) {
			showErrorToast('Course name, department, and category are required');
			return;
		}
		
		try {
			setLoading(true);
			
			// Find department and category IDs
			const department = departments.find(d => d.name === course.departmentName);
			const category = categories.find(c => c.name === course.categoryName);
			
			if (!department || !category) {
				showErrorToast('Department and category are required');
				setLoading(false);
				return;
			}
			
			// First upload the image if there is one
			let imageUrl = course.imageUrl;
			if (course.image) {
				const formData = new FormData();
				formData.append('file', course.image);
				// Use 'image' as the type instead of 'course'
				formData.append('type', 'image');
				
				try {
					console.log('Uploading course image...');
					const response = await api.admin.uploadFile(formData);
					console.log('Image upload response:', response);
					if (response.success) {
						imageUrl = response.data.fileUrl;
						console.log('Image uploaded successfully:', imageUrl);
					}
				} catch (error) {
					console.error('Error uploading course image:', error);
					showErrorToast('Failed to upload course image');
				}
			}
			
			const courseData = {
				name: course.name,
				departmentId: department._id,
				categoryId: category._id,
				feeStructure: course.feeStructure,
				formUrl: course.formUrl,
				thumbnailUrl: imageUrl,
				fileUrl: imageUrl,
			};
			
			console.log('Sending course data:', courseData);
			
			if (editingCourse) {
				// Update existing course
				const updateResponse = await api.admin.updateCourse(editingCourse._id, courseData);
				console.log('Course update response:', updateResponse);
				showSuccessToast('Course updated successfully');
			} else {
				// Add new course
				const addResponse = await api.admin.addCourse(courseData);
				console.log('Course add response:', addResponse);
				showSuccessToast('Course added successfully');
			}
			
			// Reset form and refresh courses
			setCourse({
				name: '',
				departmentName: '',
				categoryName: '',
				feeStructure: { registrationFee: 0, fullFee: 0 },
				formUrl: '',
				image: null,
				imageUrl: '',
			});
			setEditingCourse(null);
			
			// Refresh courses
			const coursesRes = await api.admin.getCourses();
			const courses = coursesRes?.data || coursesRes || [];
			console.log('Refreshed courses:', courses);
			setCourses(courses);
		} catch (error) {
			console.error('Error adding/updating course:', error);
			showErrorToast('Failed to add/update course: ' + (error.message || 'Unknown error'));
		} finally {
			setLoading(false);
		}
	};

	const handleAddDepartment = async () => {
		if (!newDept) {
			showErrorToast("Department name is required");
			return;
		}

		setLoading(true);
		try {
			const response = await api.admin.addDepartment({ name: newDept });
			setDepartments([...departments, response.data]);
			showSuccessToast("Department added successfully");
			setNewDept("");
		} catch (error) {
			// Error is already handled by the API interceptor
		} finally {
			setLoading(false);
		}
	};

	const handleAddCategory = async () => {
		if (!newCat) {
			showErrorToast("Category name is required");
			return;
		}

		setLoading(true);
		try {
			const response = await api.admin.addCategory({ name: newCat });
			setCategories([...categories, response.data]);
			showSuccessToast("Category added successfully");
			setNewCat("");
		} catch (error) {
			// Error is already handled by the API interceptor
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateAdmission = async (id, status) => {
		setLoading(true);
		try {
			const response = await api.admin.updateAdmission(id, { status });
			setAdmissions(
				admissions.map((adm) => (adm._id === id ? response.data : adm))
			);
			showSuccessToast(`Admission ${status} successfully`);
		} catch (error) {
			// Error is already handled by the API interceptor
		} finally {
			setLoading(false);
		}
	};

	const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
	const handleMenuClose = () => setAnchorEl(null);
	const handleRedirect = (path) => {
		handleMenuClose();
		navigate(path);
	};

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setUploadedFile(e.target.files[0]);
		}
	};

	const handleFileUpload = async () => {
		if (!uploadedFile) {
			showErrorToast("Please select a file to upload");
			return;
		}

		if (!contentForm.type) {
			showErrorToast("Please select a content type");
			return;
		}

		setLoading(true);
		try {
			const formData = new FormData();
			formData.append('file', uploadedFile);
			formData.append('type', contentForm.type);
			
			if (contentForm.title) formData.append('title', contentForm.title);
			if (contentForm.description) formData.append('description', contentForm.description);
			
			// For gallery items, add the category
			if (contentForm.type === 'gallery' && selectedGalleryCategory) {
				formData.append('category', selectedGalleryCategory);
			}

			console.log('Uploading file:', uploadedFile.name);
			console.log('Content type:', contentForm.type);
			
			const response = await api.admin.uploadFile(formData);
			
			if (response.success) {
				showSuccessToast("File uploaded successfully");
				
				// Set the file URL in the content form
				setContentForm({
					...contentForm,
					fileUrl: response.data.fileUrl
				});
				
				setUploadedFile(null);
				
				const fileInput = document.querySelector('#file-upload');
				if (fileInput) fileInput.value = '';
				
				// Refresh content list
				const contentResponse = await (contentType === 'all' 
					? api.admin.getAllContent()
					: api.admin.getContentByType(contentType));
				setContentList(contentResponse || []);
			} else {
				showErrorToast(response.error || "Failed to upload file");
			}
		} catch (error) {
			console.error("File upload error:", error);
			showErrorToast("Error uploading file. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteContent = async (id) => {
		try {
			setLoading(true);
			console.log('Deleting content with ID:', id);
			
			// Use a try-catch to properly handle the API response
			const response = await api.admin.deleteContent(id);
			
			// Only show success message if we get here (no error was thrown)
			showSuccessToast('Content deleted successfully!');
			
			// Force refresh content list
			setRefreshTrigger(prev => prev + 1);
			
			// Also refresh gallery categories if needed
			if (contentType === 'gallery' || contentType === 'all') {
				console.log('Refreshing gallery categories');
				const galleryContent = await api.admin.getContentByType('gallery');
				// Find gallery categories by checking the category field for 'category'
				const categories = (galleryContent?.data || galleryContent || [])
					.filter(item => item.category === 'category') || [];
				console.log('Gallery categories:', categories);
				setGalleryCategories(categories);
			}
		} catch (error) {
			// Error toast is already shown by the API interceptor
			console.error('Error deleting content:', error);
			// Don't show another error toast here as the interceptor already does that
		} finally {
			setLoading(false);
		}
	};

	const handleAddTestimonial = async () => {
		try {
			setLoading(true);
			
			// Validate form
			if (!testimonialForm.title || !testimonialForm.description) {
				showErrorToast('Please fill in all required fields');
				setLoading(false);
				return;
			}
			
			const testimonialData = {
				type: 'testimonial',
				title: testimonialForm.title,
				description: testimonialForm.description,
				thumbnailUrl: testimonialForm.thumbnailUrl || '',
				fileUrl: testimonialForm.thumbnailUrl || '/images/team/person1.jpg',
			};
			
			console.log('Saving testimonial data:', testimonialData);
			
			if (editingTestimonialId) {
				// Update existing testimonial
				await api.admin.updateContent(editingTestimonialId, testimonialData);
				showSuccessToast('Testimonial updated successfully!');
			} else {
				// Add new testimonial
				await api.admin.addContent(testimonialData);
				showSuccessToast('Testimonial added successfully!');
			}
			
			// Reset form and refresh testimonials
			setTestimonialForm({
				title: "",
				description: "",
				thumbnailUrl: "",
			});
			setEditingTestimonialId(null);
			
			// Refresh testimonials list
			const response = await api.admin.getContentByType('testimonial');
			setTestimonials(response || []);
		} catch (error) {
			console.error('Error saving testimonial:', error);
			showErrorToast('Failed to save testimonial. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleEditTestimonial = (testimonial) => {
		setTestimonialForm({
			title: testimonial.title || '',
			description: testimonial.description || '',
			thumbnailUrl: testimonial.thumbnailUrl || '',
		});
		setEditingTestimonialId(testimonial._id);
	};

	const handleDeleteTestimonial = async (id) => {
		try {
			setLoading(true);
			console.log('Deleting testimonial with ID:', id);
			
			// Use a try-catch to properly handle the API response
			const response = await api.admin.deleteContent(id);
			
			// Only show success message if we get here (no error was thrown)
			showSuccessToast('Testimonial deleted successfully!');
			
			// Refresh testimonials list
			console.log('Refreshing testimonials list');
			const testimonialsResponse = await api.admin.getContentByType('testimonial');
			console.log('Testimonials response:', testimonialsResponse);
			setTestimonials(testimonialsResponse || []);
		} catch (error) {
			// Error toast is already shown by the API interceptor
			console.error('Error deleting testimonial:', error);
			// Don't show another error toast here as the interceptor already does that
		} finally {
			setLoading(false);
		}
	};

	const handleCancelEditTestimonial = () => {
		setTestimonialForm({
			title: "",
			description: "",
			thumbnailUrl: "",
		});
		setEditingTestimonialId(null);
	};

	const handleEditContent = (content) => {
		setEditingContent(content);
		setContentForm({
			type: content.type || '',
			title: content.title || '',
			description: content.description || '',
			fileUrl: content.fileUrl || '',
			thumbnailUrl: content.thumbnailUrl || '',
			category: content.category || '',
			file: null,
			filePreview: content.fileUrl || content.thumbnailUrl || null,
			courseId: content.courseId || '',
		});
	};

	const handleCancelEditContent = () => {
		setEditingContent(null);
		setContentForm({
			type: '',
			title: '',
			description: '',
			category: '',
			file: null,
			filePreview: null,
			courseId: '',
		});
	};

	const handleUpdateContent = async () => {
		try {
			setLoading(true);
			
			// Validate form
			if (!contentForm.title || !contentForm.type) {
				showErrorToast('Please fill in all required fields');
				setLoading(false);
				return;
			}
			
			// First upload the file if there is one
			let fileUrl = contentForm.fileUrl || '';
			let thumbnailUrl = contentForm.thumbnailUrl || '';
			
			if (contentForm.file) {
				const formData = new FormData();
				formData.append('file', contentForm.file);
				formData.append('type', contentForm.type === 'gallery-category' ? 'gallery' : contentForm.type);
				
				try {
					console.log('Uploading content file for update...');
					const response = await api.admin.uploadFile(formData);
					console.log('File upload response:', response);
					if (response.success) {
						fileUrl = response.data.fileUrl;
						thumbnailUrl = response.data.fileUrl; // Use same URL for thumbnail
						console.log('File uploaded successfully:', fileUrl);
					} else {
						// If upload not successful but we don't have a fileUrl, use placeholder
						if (!fileUrl) {
							console.warn('File upload was not successful and no existing fileUrl, using placeholder');
							fileUrl = 'https://via.placeholder.com/800x600?text=No+Image';
							thumbnailUrl = thumbnailUrl || fileUrl;
						}
					}
				} catch (error) {
					console.error('Error uploading file:', error);
					showErrorToast('Failed to upload file');
					// If we don't have a fileUrl, use placeholder
					if (!fileUrl) {
						fileUrl = 'https://via.placeholder.com/800x600?text=No+Image';
						thumbnailUrl = thumbnailUrl || fileUrl;
					}
				}
			} else if (!fileUrl) {
				// If no file URL exists and no new file is uploaded, use placeholder
				fileUrl = 'https://via.placeholder.com/800x600?text=No+Image';
				thumbnailUrl = thumbnailUrl || fileUrl;
			}
			
			// Prepare content data - ALWAYS include fileUrl
			const contentData = {
				type: contentForm.type === 'gallery-category' ? 'gallery' : contentForm.type,
				title: contentForm.title,
				description: contentForm.description || '',
				fileUrl: fileUrl, // Always provide a fileUrl
				thumbnailUrl: thumbnailUrl || fileUrl, // Use fileUrl as fallback
				category: contentForm.type === 'gallery-category' ? 'category' : (contentForm.category || ''),
				courseId: contentForm.courseId || undefined,
			};
			
			console.log('Updating content with data:', contentData);
			
			const updateResponse = await api.admin.updateContent(editingContent._id, contentData);
			console.log('Update response:', updateResponse);
			
			showSuccessToast('Content updated successfully!');
			
			// Reset form
			handleCancelEditContent();
			
			// Force refresh content list
			setRefreshTrigger(prev => prev + 1);
			
			// Refresh gallery categories if needed
			if (contentForm.type === 'gallery-category' || contentForm.type === 'gallery' || contentType === 'gallery' || contentType === 'all') {
				try {
					const galleryResponse = await api.admin.getContentByType('gallery');
					console.log('Gallery refresh response:', galleryResponse);
					
					const galleryContent = galleryResponse?.data || galleryResponse || [];
					const categories = galleryContent.filter(item => item.category === 'category') || [];
					
					console.log('Updated gallery categories:', categories);
					setGalleryCategories(categories);
				} catch (error) {
					console.error('Error refreshing gallery categories:', error);
				}
			}
		} catch (error) {
			console.error('Error updating content:', error);
			showErrorToast('Failed to update content: ' + (error.response?.data?.error || error.message));
		} finally {
			setLoading(false);
		}
	};

	const handleContentTypeChange = (e) => {
		setContentType(e.target.value);
	};

	const handleEditCourse = (course) => {
		setEditingCourse(course);
		setCourse({
			name: course.name,
			departmentName: course.departmentId?.name || '',
			categoryName: course.categoryId?.name || '',
			feeStructure: {
				registrationFee: course.feeStructure?.registrationFee || 0,
				fullFee: course.feeStructure?.fullFee || 0
			},
			formUrl: course.formUrl || '',
			image: null,
			imageUrl: course.thumbnailUrl || course.fileUrl || '',
		});
	};

	const handleCancelEditCourse = () => {
		setEditingCourse(null);
		setCourse({
			name: '',
			departmentName: '',
			categoryName: '',
			feeStructure: { registrationFee: 0, fullFee: 0 },
			formUrl: '',
			image: null,
			imageUrl: '',
		});
	};

	const handleDeleteCourse = async (id) => {
		try {
			setLoading(true);
			console.log('Deleting course with ID:', id);
			
			await api.admin.deleteCourse(id);
			showSuccessToast('Course deleted successfully');
			
			// Refresh courses
			console.log('Refreshing courses list');
			const coursesRes = await api.admin.getCourses();
			const courses = coursesRes?.data || coursesRes || [];
			console.log('Courses response:', courses);
			setCourses(courses);
		} catch (error) {
			console.error('Error deleting course:', error);
			showErrorToast('Failed to delete course');
		} finally {
			setLoading(false);
		}
	};

	const handleCourseImageChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setCourse({
				...course,
				image: file,
				imageUrl: URL.createObjectURL(file)
			});
		}
	};

	const handleAddGalleryCategory = async () => {
		if (!contentForm.title) {
			showErrorToast("Category name is required");
			return;
		}

		setLoading(true);
		try {
			// First upload the file if there is one
			let fileUrl = '';
			let thumbnailUrl = '';
			
			if (contentForm.file) {
				const formData = new FormData();
				formData.append('file', contentForm.file);
				formData.append('type', 'gallery');
				
				try {
					console.log('Uploading gallery category image...');
					const response = await api.admin.uploadFile(formData);
					console.log('File upload response:', response);
					if (response.success) {
						fileUrl = response.data.fileUrl;
						thumbnailUrl = response.data.fileUrl;
					}
				} catch (error) {
					console.error('Error uploading file:', error);
					// Don't return, just use placeholder image
					fileUrl = 'https://via.placeholder.com/800x600?text=Gallery+Category';
					thumbnailUrl = fileUrl;
				}
			} else {
				fileUrl = 'https://via.placeholder.com/800x600?text=Gallery+Category';
				thumbnailUrl = fileUrl;
			}
			
			// Prepare category data
			const categoryData = {
				type: 'gallery',
				title: contentForm.title,
				description: contentForm.description || '',
				fileUrl: fileUrl,
				thumbnailUrl: thumbnailUrl,
				category: 'category', // This identifies it as a category
			};
			
			console.log('Adding gallery category with data:', categoryData);
			
			// Add the category
			const response = await api.admin.addContent(categoryData);
			console.log('Gallery category add response:', response);
			
			showSuccessToast("Gallery category added successfully");
			
			// Reset form
			setContentForm({
				type: "",
				title: "",
				description: "",
				category: "",
				file: null,
				filePreview: null,
				courseId: '',
			});
			
			// Force refresh content list
			setRefreshTrigger(prev => prev + 1);
			
			// Refresh gallery categories
			const galleryResponse = await api.admin.getContentByType('gallery');
			const galleryContent = galleryResponse?.data || galleryResponse || [];
			const categories = galleryContent.filter(item => item.category === 'category') || [];
			setGalleryCategories(categories);
			
		} catch (error) {
			console.error('Error adding gallery category:', error);
			showErrorToast('Failed to add gallery category: ' + (error.response?.data?.error || error.message));
		} finally {
			setLoading(false);
		}
	};

	const handleContentFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			
			// Set file and preview in form
			setContentForm({
				...contentForm,
				file: file,
				filePreview: URL.createObjectURL(file)
			});
		}
	};

	useEffect(() => {
		if ((contentForm.type === 'syllabus' || contentForm.type === 'datesheet') && courses.length === 0) {
			// Fetch courses only if not already loaded
			api.admin.getCourses().then(res => {
				const courseList = res?.data || res || [];
				setCourses(courseList);
			}).catch(err => {
				setCourses([]);
			});
		}
		// Optionally, clear courseId if type changes to something else
		if (contentForm.type !== 'syllabus' && contentForm.type !== 'datesheet' && contentForm.courseId) {
			setContentForm(form => ({ ...form, courseId: '' }));
		}
	}, [contentForm.type]);

	return (
		<Container maxWidth="xl" sx={{ py: 4 }}>
			<Typography variant="h4" gutterBottom>
				Admin Dashboard
			</Typography>

			<Tabs
				value={tab}
				onChange={(e, newValue) => setTab(newValue)}
				variant="scrollable"
				scrollButtons="auto"
				sx={{ mb: 4 }}
			>
				<Tab label="Content" />
				<Tab label="Users" />
				<Tab label="Courses" />
				<Tab label="Admissions" />
				<Tab label="Testimonials" />
				<Tab label="Payments" />
				<Tab label="ID Cards" />
				<Tab label="Results" />
			</Tabs>

			{loading ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
					<CircularProgress />
				</Box>
			) : (
				<>
					{tab === 0 && (
						<Box>
							<Typography variant="h5" gutterBottom>
								Content Management
							</Typography>
							
							<Grid container spacing={3}>
								{/* Content Type Filter */}
								<Grid item xs={12}>
									<Paper sx={{ p: 3, mb: 3 }}>
										<FormControl fullWidth>
											<InputLabel>Content Type</InputLabel>
											<Select
												value={contentType}
												onChange={handleContentTypeChange}
												label="Content Type"
											>
												<MenuItem value="all">All Content</MenuItem>
												<MenuItem value="announcement">Announcements</MenuItem>
												<MenuItem value="news">News</MenuItem>
												<MenuItem value="event">Events</MenuItem>
												<MenuItem value="syllabus">Syllabus</MenuItem>
												<MenuItem value="datesheet">Datesheet</MenuItem>
												<Divider sx={{ my: 1 }} />
												<MenuItem sx={{ 
													backgroundColor: 'rgba(0, 0, 0, 0.05)', 
													fontWeight: 'bold',
													pointerEvents: 'none' 
												}}>
													Gallery Management
												</MenuItem>
												<MenuItem value="gallery">Gallery Items</MenuItem>
												<Divider sx={{ my: 1 }} />
												<MenuItem value="about">Testimonials</MenuItem>
											</Select>
										</FormControl>
									</Paper>
								</Grid>
								
								{/* Content List */}
								<Grid item xs={12} md={8}>
									<Paper sx={{ p: 3 }}>
										<Typography variant="h6" gutterBottom>
											Content List
										</Typography>
										
										{loading ? (
											<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
												<CircularProgress />
											</Box>
										) : Array.isArray(contentList) && contentList.length > 0 ? (
											contentList.map((content) => (
												<Paper 
													key={content._id} 
													sx={{ 
														p: 2, 
														mb: 2, 
														border: '1px solid #eee',
														position: 'relative'
													}}
												>
													<Grid container spacing={2}>
														<Grid item xs={12} sm={3}>
															{content.thumbnailUrl || content.fileUrl ? (
																<Box
																	component="img"
																	src={content.thumbnailUrl || content.fileUrl}
																	alt={content.title}
																	sx={{ 
																		width: '100%', 
																		height: 100, 
																		objectFit: 'cover',
																		borderRadius: 1
																	}}
																/>
															) : (
																<Box
																	sx={{ 
																		width: '100%', 
																		height: 100, 
																		bgcolor: 'grey.200',
																		borderRadius: 1,
																		display: 'flex',
																		alignItems: 'center',
																		justifyContent: 'center'
																	}}
																>
																	No Image
																</Box>
															)}
														</Grid>
														<Grid item xs={12} sm={9}>
															<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
																<Box>
																	<Typography variant="subtitle1" fontWeight="bold">
																		{content.title}
																	</Typography>
																	<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
																		Type: {content.type} | Created: {new Date(content.uploadedAt).toLocaleDateString()}
																	</Typography>
																	<Typography variant="body2" sx={{ mb: 2 }}>
																		{content.description?.substring(0, 150)}
																		{content.description?.length > 150 ? '...' : ''}
																	</Typography>
																</Box>
																<Box>
																	<Button
																		size="small"
																		startIcon={<EditIcon />}
																		onClick={() => handleEditContent(content)}
																		sx={{ mr: 1 }}
																	>
																		Edit
																	</Button>
																	<Button
																		size="small"
																		color="error"
																		startIcon={<DeleteIcon />}
																		onClick={() => handleDeleteContent(content._id)}
																	>
																		Delete
																	</Button>
																</Box>
															</Box>
														</Grid>
													</Grid>
												</Paper>
											))
										) : (
											<Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
												No content found. Add content using the form.
											</Typography>
										)}
									</Paper>
								</Grid>
								
								{/* Edit Content Form */}
								<Grid item xs={12} md={4}>
									<Paper sx={{ p: 3 }}>
										<Typography variant="h6" gutterBottom>
											{editingContent ? 'Edit Content' : 'Add New Content'}
										</Typography>
										
										<FormControl fullWidth sx={{ mb: 2 }}>
											<InputLabel>Content Type</InputLabel>
											<Select
												value={contentForm.type}
												onChange={(e) => setContentForm({ ...contentForm, type: e.target.value })}
												label="Content Type"
												disabled={!!editingContent}
												required
												error={!contentForm.type}
											>
												<MenuItem value="announcement">Announcement</MenuItem>
												<MenuItem value="news">News</MenuItem>
												<MenuItem value="event">Event</MenuItem>
												<MenuItem value="syllabus">Syllabus</MenuItem>
												<MenuItem value="datesheet">Datesheet</MenuItem>
												<Divider sx={{ my: 1 }} />
												<MenuItem sx={{ 
													backgroundColor: 'rgba(0, 0, 0, 0.05)', 
													fontWeight: 'bold',
													pointerEvents: 'none' 
												}}>
													Gallery Management
												</MenuItem>
												<MenuItem value="gallery-category">Gallery Category</MenuItem>
												<MenuItem value="gallery">Gallery Item</MenuItem>
												<Divider sx={{ my: 1 }} />
												<MenuItem value="about">Testimonial</MenuItem>
											</Select>
											{!contentForm.type && (
												<FormHelperText error>Content type is required</FormHelperText>
											)}
											{contentForm.type === 'gallery-category' && (
												<FormHelperText>
													Create a gallery category first, then add gallery items to it.
												</FormHelperText>
											)}
											{contentForm.type === 'gallery' && (
												<FormHelperText>
													Add a gallery item to an existing category.
												</FormHelperText>
											)}
										</FormControl>
										
										{(contentForm.type === 'syllabus' || contentForm.type === 'datesheet') && (
											<FormControl fullWidth sx={{ mb: 2 }}>
												<InputLabel>Course</InputLabel>
												<Select
													value={contentForm.courseId}
													onChange={e => setContentForm({ ...contentForm, courseId: e.target.value })}
													label="Course"
													required
													error={!contentForm.courseId}
												>
													{courses && courses.length > 0 ? (
														courses.map(course => (
															<MenuItem key={course._id} value={course._id}>{course.name}</MenuItem>
														))
													) : (
														<MenuItem disabled value="">No courses available</MenuItem>
													)}
												</Select>
												{!contentForm.courseId && <FormHelperText error>Course is required</FormHelperText>}
											</FormControl>
										)}
										
										{contentForm.type === 'gallery-category' && (
											<Box sx={{ mb: 2 }}>
												<Typography variant="subtitle2" color="text.secondary">
													Creating a new gallery category
												</Typography>
											</Box>
										)}
										
										<TextField
											label="Title"
											fullWidth
											margin="normal"
											value={contentForm.title}
											onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
											required
										/>
										
										<TextField
											label="Description"
											fullWidth
											margin="normal"
											multiline
											rows={4}
											value={contentForm.description}
											onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
										/>
										
										{/* File Upload Section */}
										<Box sx={{ mt: 2, mb: 2 }}>
											<Typography variant="subtitle1" gutterBottom>
												Upload File
											</Typography>
											<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
												<Button
													variant="contained"
													component="label"
													startIcon={<CloudUploadIcon />}
													sx={{ mr: 2 }}
												>
													Choose File
													<input
														type="file"
														id="file-upload"
														hidden
														onChange={handleContentFileChange}
													/>
												</Button>
												{contentForm.file && (
													<Typography variant="body2">
														{contentForm.file.name}
													</Typography>
												)}
											</Box>
											
											{/* File Preview */}
											{contentForm.filePreview && (
												<Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
													<img 
														src={contentForm.filePreview} 
														alt="Preview" 
														style={{ 
															maxWidth: '100%', 
															maxHeight: '200px',
															borderRadius: '4px',
															border: '1px solid #ddd'
														}} 
													/>
												</Box>
											)}
										</Box>
										
										<Button
											variant="contained"
											color="primary"
											fullWidth
											onClick={handleAddContent}
											disabled={loading || !contentForm.type || !contentForm.title}
											sx={{ mt: 2 }}
										>
											{loading ? "Adding..." : "Add Content"}
										</Button>
									</Paper>
								</Grid>
							</Grid>
						</Box>
					)}

					{tab === 1 && (
						<Paper sx={{ p: 3 }}>
							<Typography variant="h6" gutterBottom>User Management</Typography>
							
							{/* Users Table */}
							<Paper sx={{ p: 3, mb: 4 }}>
								<Typography variant="subtitle1" gutterBottom>Students</Typography>
								{users.students.length > 0 ? (
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Name</TableCell>
												<TableCell>Email</TableCell>
												<TableCell>Mobile</TableCell>
												<TableCell>Actions</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{users.students.map((student) => (
												<TableRow key={student._id}>
													<TableCell>{student.name}</TableCell>
													<TableCell>{student.email}</TableCell>
													<TableCell>{student.mobile}</TableCell>
													<TableCell>
														<IconButton color="primary">
															<EditIcon />
														</IconButton>
														<IconButton color="error">
															<DeleteIcon />
														</IconButton>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								) : (
									<Typography>No students found</Typography>
								)}
							</Paper>
							
							<Paper sx={{ p: 3 }}>
								<Typography variant="subtitle1" gutterBottom>Faculty</Typography>
								{users.faculty.length > 0 ? (
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Name</TableCell>
												<TableCell>Email</TableCell>
												<TableCell>Department</TableCell>
												<TableCell>Actions</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{users.faculty.map((faculty) => (
												<TableRow key={faculty._id}>
													<TableCell>{faculty.name}</TableCell>
													<TableCell>{faculty.email}</TableCell>
													<TableCell>{faculty.department}</TableCell>
													<TableCell>
														<IconButton color="primary">
															<EditIcon />
														</IconButton>
														<IconButton color="error">
															<DeleteIcon />
														</IconButton>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								) : (
									<Typography>No faculty found</Typography>
								)}
							</Paper>
						</Paper>
					)}

					{tab === 2 && (
						<Box>
							<Typography variant="h5" gutterBottom>
								Course Management
							</Typography>
							
							<Grid container spacing={3}>
								{/* Course Form */}
								<Grid item xs={12} md={6}>
									<Paper sx={{ p: 3, mb: 3 }}>
										<Typography variant="h6" gutterBottom>
											{editingCourse ? 'Edit Course' : 'Add New Course'}
										</Typography>
										
										<TextField
											label="Course Name"
											value={course.name}
											onChange={(e) => setCourse({ ...course, name: e.target.value })}
											fullWidth
											sx={{ mb: 2 }}
										/>
										
										<FormControl fullWidth sx={{ mb: 2 }}>
											<InputLabel>Department</InputLabel>
											<Select
												value={course.departmentName}
												onChange={(e) => setCourse({ ...course, departmentName: e.target.value })}
												label="Department"
											>
												{Array.isArray(departments) && departments.length > 0 ? (
													departments.map((dept) => (
														<MenuItem key={dept._id || Math.random()} value={dept.name}>
															{dept.name}
														</MenuItem>
													))
												) : (
													<MenuItem disabled value="">
														No departments available
													</MenuItem>
												)}
											</Select>
										</FormControl>
										
										<FormControl fullWidth sx={{ mb: 2 }}>
											<InputLabel>Category</InputLabel>
											<Select
												value={course.categoryName}
												onChange={(e) => setCourse({ ...course, categoryName: e.target.value })}
												label="Category"
											>
												{Array.isArray(categories) && categories.length > 0 ? (
													categories.map((cat) => (
														<MenuItem key={cat._id || Math.random()} value={cat.name}>
															{cat.name}
														</MenuItem>
													))
												) : (
													<MenuItem disabled value="">
														No categories available
													</MenuItem>
												)}
											</Select>
										</FormControl>
										
										<TextField
											label="Registration Fee"
											value={course.feeStructure.registrationFee}
											onChange={(e) => setCourse({
												...course,
												feeStructure: {
													...course.feeStructure,
													registrationFee: Number(e.target.value)
												}
											})}
											fullWidth
											sx={{ mb: 2 }}
											type="number"
										/>
										
										<TextField
											label="Full Fee"
											value={course.feeStructure.fullFee}
											onChange={(e) => setCourse({
												...course,
												feeStructure: {
													...course.feeStructure,
													fullFee: Number(e.target.value)
												}
											})}
											fullWidth
											sx={{ mb: 2 }}
											type="number"
										/>
										
										<TextField
											label="Form URL (Optional)"
											value={course.formUrl}
											onChange={(e) => setCourse({ ...course, formUrl: e.target.value })}
											fullWidth
											sx={{ mb: 2 }}
										/>
										
										{/* Course Image Upload */}
										<Box sx={{ mb: 3 }}>
											<Typography variant="subtitle1" gutterBottom>
												Course Image
											</Typography>
											
											{course.imageUrl && (
												<Box sx={{ mb: 2, position: 'relative', width: '100%', height: 200, borderRadius: 1, overflow: 'hidden' }}>
													<img 
														src={course.imageUrl} 
														alt="Course preview" 
														style={{ width: '100%', height: '100%', objectFit: 'cover' }}
													/>
													<IconButton
														sx={{
															position: 'absolute',
															top: 8,
															right: 8,
															bgcolor: 'rgba(0,0,0,0.5)',
															color: 'white',
															'&:hover': {
																bgcolor: 'rgba(0,0,0,0.7)',
															}
														}}
														onClick={() => setCourse({...course, image: null, imageUrl: ''})}
													>
														<DeleteIcon />
													</IconButton>
												</Box>
											)}
											
											<Button
												variant="outlined"
												component="label"
												startIcon={<CloudUploadIcon />}
												fullWidth
											>
												{course.image ? 'Change Image' : 'Upload Image'}
												<input
													type="file"
													hidden
													accept="image/*"
													onChange={handleCourseImageChange}
												/>
											</Button>
											<FormHelperText>
												Recommended size: 800x600 pixels. Max file size: 5MB
											</FormHelperText>
										</Box>
										
										<Box sx={{ display: 'flex', gap: 2 }}>
											<Button
												variant="contained"
												onClick={handleAddCourse}
												disabled={loading}
											>
												{loading ? 'Saving...' : editingCourse ? 'Update Course' : 'Add Course'}
											</Button>
											
											{editingCourse && (
												<Button
													variant="outlined"
													onClick={handleCancelEditCourse}
												>
													Cancel
												</Button>
											)}
										</Box>
									</Paper>
									
									{/* Department and Category Management */}
									<Paper sx={{ p: 3 }}>
										<Typography variant="h6" gutterBottom>
											Department Management
										</Typography>
										<TextField
											label='Department Name'
											value={newDept}
											onChange={(e) => setNewDept(e.target.value)}
											fullWidth
											sx={{ mb: 2 }}
										/>
										<Button 
											variant="contained" 
											onClick={handleAddDepartment}
											disabled={loading}
											fullWidth
										>
											{loading ? <CircularProgress size={24} /> : "Add Department"}
										</Button>
									</Paper>
									<Paper sx={{ p: 3 }}>
										<Typography variant="h6" gutterBottom>
											Category Management
										</Typography>
										<TextField
											label='Category Name'
											value={newCat}
											onChange={(e) => setNewCat(e.target.value)}
											fullWidth
											sx={{ mb: 2 }}
										/>
										<Button 
											variant="contained" 
											onClick={handleAddCategory}
											disabled={loading}
											fullWidth
										>
											{loading ? <CircularProgress size={24} /> : "Add Category"}
										</Button>
									</Paper>
								</Grid>
								
								{/* Course List */}
								<Grid item xs={12} md={6}>
									<Paper sx={{ p: 3 }}>
										<Typography variant="h6" gutterBottom>
											Existing Courses
										</Typography>
										
										{loading ? (
											<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
												<CircularProgress />
											</Box>
										) : Array.isArray(courses) && courses.length > 0 ? (
											<Table>
												<TableHead>
													<TableRow>
														<TableCell><strong>Name</strong></TableCell>
														<TableCell><strong>Department</strong></TableCell>
														<TableCell><strong>Category</strong></TableCell>
														<TableCell><strong>Fees</strong></TableCell>
														<TableCell><strong>Actions</strong></TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{courses.map((c) => (
														<TableRow key={c._id || Math.random()}>
															<TableCell>{c.name}</TableCell>
															<TableCell>{c.departmentId?.name || 'Unknown'}</TableCell>
															<TableCell>{c.categoryId?.name || 'Unknown'}</TableCell>
															<TableCell>
																<Typography variant="body2">
																	Reg: ₹{c.feeStructure?.registrationFee?.toLocaleString() || '0'}
																</Typography>
																<Typography variant="body2">
																	Full: ₹{c.feeStructure?.fullFee?.toLocaleString() || '0'}
																</Typography>
															</TableCell>
															<TableCell>
																<Button
																	size="small"
																	startIcon={<EditIcon />}
																	onClick={() => handleEditCourse(c)}
																	sx={{ mr: 1 }}
																>
																	Edit
																</Button>
																<Button
																	size="small"
																	color="error"
																	startIcon={<DeleteIcon />}
																	onClick={() => handleDeleteCourse(c._id)}
																>
																	Delete
																</Button>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										) : (
											<Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
												No courses found. Add your first course!
											</Typography>
										)}
									</Paper>
								</Grid>
							</Grid>
						</Box>
					)}

					{tab === 3 && (
						<Paper sx={{ p: 3 }}>
							<Typography variant="h6" gutterBottom>Admissions Management</Typography>
							{loading ? (
								<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
									<CircularProgress />
								</Box>
							) : admissions && admissions.length > 0 ? (
								<Table>
									<TableHead>
										<TableRow>
											<TableCell><Typography fontWeight="bold">Student Name</Typography></TableCell>
											<TableCell><Typography fontWeight="bold">Course</Typography></TableCell>
											<TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
											<TableCell><Typography fontWeight="bold">Date Applied</Typography></TableCell>
											<TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{admissions.map((adm) => (
											<TableRow key={adm._id}>
												<TableCell>{adm.studentId?.name || "Unknown Student"}</TableCell>
												<TableCell>{adm.courseId?.name || "Unknown Course"}</TableCell>
												<TableCell>
													<Chip 
														label={adm.status} 
														color={
															adm.status === "approved" ? "success" : 
															adm.status === "rejected" ? "error" : 
															"warning"
														}
														size="small"
													/>
												</TableCell>
												<TableCell>
													{new Date(adm.createdAt).toLocaleDateString()}
												</TableCell>
												<TableCell>
													<Button 
														onClick={() => handleUpdateAdmission(adm._id, "approved")}
														disabled={adm.status === "approved" || loading}
														color="success"
														variant="contained"
														size="small"
														sx={{ mr: 1 }}
													>
														Approve
													</Button>
													<Button 
														onClick={() => handleUpdateAdmission(adm._id, "rejected")}
														disabled={adm.status === "rejected" || loading}
														color="error"
														variant="contained"
														size="small"
													>
														Reject
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<Box sx={{ textAlign: 'center', p: 3 }}>
									<Typography>No admissions found</Typography>
									<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
										Admissions will appear here when students apply for courses.
									</Typography>
								</Box>
							)}
						</Paper>
					)}

					{tab === 4 && (
						<Box>
							<Typography variant="h5" gutterBottom>
								Testimonial Management
							</Typography>
							
							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<Paper sx={{ p: 3, mb: 3 }}>
										<Typography variant="h6" gutterBottom>
											{editingTestimonialId ? 'Edit Testimonial' : 'Add New Testimonial'}
										</Typography>
										
										<TextField
											label="Student Name"
											fullWidth
											margin="normal"
											value={testimonialForm.title}
											onChange={(e) => setTestimonialForm(prev => ({ ...prev, title: e.target.value }))}
											required
										/>
										
										<TextField
											label="Testimonial Content"
											fullWidth
											margin="normal"
											multiline
											rows={4}
											value={testimonialForm.description}
											onChange={(e) => setTestimonialForm(prev => ({ ...prev, description: e.target.value }))}
											required
											helperText={`${testimonialForm.description.length}/500 characters (minimum 50)`}
											error={testimonialForm.description.length > 0 && testimonialForm.description.length < 50}
										/>
										
										<TextField
											label="Student Photo URL"
											fullWidth
											margin="normal"
											value={testimonialForm.thumbnailUrl}
											onChange={(e) => setTestimonialForm(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
											helperText="Leave blank to use default avatar"
										/>
										
										<Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
											<Button
												variant="contained"
												color="primary"
												onClick={handleAddTestimonial}
												disabled={loading || !testimonialForm.title || testimonialForm.description.length < 50}
											>
												{loading ? 'Saving...' : editingTestimonialId ? 'Update Testimonial' : 'Add Testimonial'}
											</Button>
											
											{editingTestimonialId && (
												<Button
													variant="outlined"
													onClick={handleCancelEditTestimonial}
												>
													Cancel
												</Button>
											)}
										</Box>
									</Paper>
								</Grid>
								
								<Grid item xs={12} md={6}>
									<Paper sx={{ p: 3 }}>
										<Typography variant="h6" gutterBottom>
											Existing Testimonials
										</Typography>
										
										{loading ? (
											<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
												<CircularProgress />
											</Box>
										) : testimonials.length > 0 ? (
											testimonials.map((testimonial) => (
												<Paper 
													key={testimonial._id} 
													sx={{ 
														p: 2, 
														mb: 2, 
														border: '1px solid #eee',
														position: 'relative'
													}}
												>
													<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
														<Box
															component="img"
															src={testimonial.thumbnailUrl || '/images/team/person1.jpg'}
															alt={testimonial.title}
															sx={{ 
																width: 50, 
																height: 50, 
																borderRadius: '50%',
																mr: 2,
																objectFit: 'cover'
															}}
														/>
														<Typography variant="subtitle1" fontWeight="bold">
															{testimonial.title}
														</Typography>
													</Box>
													
													<Typography variant="body2" sx={{ mb: 2 }}>
														{testimonial.description}
													</Typography>
													
													<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
														<Button
															size="small"
															startIcon={<EditIcon />}
															onClick={() => handleEditTestimonial(testimonial)}
														>
															Edit
														</Button>
														<Button
															size="small"
															color="error"
															startIcon={<DeleteIcon />}
															onClick={() => handleDeleteTestimonial(testimonial._id)}
														>
															Delete
														</Button>
													</Box>
												</Paper>
											))
										) : (
											<Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
												No testimonials found. Add your first testimonial!
											</Typography>
										)}
									</Paper>
								</Grid>
							</Grid>
						</Box>
					)}

					{tab === 5 && (
						<Box>
							<Typography variant="h5" gutterBottom>
								Payment Management
							</Typography>
							
							<Paper sx={{ p: 3 }}>
								<Typography variant="h6" gutterBottom>
									Payment History
								</Typography>
								
								{loading ? (
									<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
										<CircularProgress />
									</Box>
								) : Array.isArray(payments) && payments.length > 0 ? (
									<Table>
										<TableHead>
											<TableRow>
												<TableCell><strong>Student</strong></TableCell>
												<TableCell><strong>Course</strong></TableCell>
												<TableCell><strong>Amount</strong></TableCell>
												<TableCell><strong>Type</strong></TableCell>
												<TableCell><strong>Date</strong></TableCell>
												<TableCell><strong>Status</strong></TableCell>
												<TableCell><strong>Actions</strong></TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{payments.map((payment) => (
												<TableRow key={payment._id || Math.random()}>
													<TableCell>
														{typeof payment.studentId === 'object' 
															? (payment.studentId?.name || payment.studentId?.email || 'Unknown')
															: (payment.studentId || 'Unknown')}
													</TableCell>
													<TableCell>
														{typeof payment.courseId === 'object'
															? (payment.courseId?.name || 'Unknown')
															: (payment.courseId || 'Unknown')}
													</TableCell>
													<TableCell>₹{payment.amount?.toLocaleString() || '0'}</TableCell>
													<TableCell>{payment.type || 'Unknown'}</TableCell>
													<TableCell>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'Unknown'}</TableCell>
													<TableCell>
														<Chip 
															label={payment.status || 'pending'} 
															color={(payment.status === 'completed' || payment.status === 'success') ? 'success' : 'warning'}
															size="small"
														/>
													</TableCell>
													<TableCell>
														<Button
															size="small"
															variant="outlined"
															onClick={() => window.open(`/receipt/${payment._id}`, '_blank')}
														>
															View Receipt
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								) : (
									<Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
										No payment records found.
									</Typography>
								)}
							</Paper>
						</Box>
					)}

					{tab === 6 && (
						<Paper sx={{ p: 3 }}>
							<IDCardGenerator 
								students={users.students} 
								departments={departments}
								courses={courses}
							/>
						</Paper>
					)}

					{tab === 7 && (
						<ResultsManagement 
							students={users.students} 
							courses={courses}
						/>
					)}
				</>
			)}
		</Container>
	);
};

export default AdminDashboard;
