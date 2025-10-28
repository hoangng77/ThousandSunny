import API from "./index";

// Get user profile by username
export const getProfile = (username) => API.get(`/profile/${username}`);

// Update current user's profile
export const updateProfile = (profileData) => API.put(`/profile`, profileData);
