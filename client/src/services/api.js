
const API_BASE = "/api";

// Common API request function
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Attach JWT token if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Get all events
export function getEvents() {
  return apiRequest("/events");
}

// Register user
export function registerUser(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// Login user
export function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

// Get current logged-in user
export function getCurrentUser() {
  return apiRequest("/auth/me");
}

export default apiRequest;

export function createEvent(eventData) {
  return apiRequest("/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
}

export function updateEvent(id, eventData) {
  return apiRequest(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(eventData),
  });
}

export function deleteEvent(id) {
  return apiRequest(`/events/${id}`, {
    method: "DELETE",
  });
}