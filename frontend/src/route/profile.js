import API from "./index";
// Profile Routes
export const getProfile = (username) => API.get(`/profile/${username}`);
export const updateProfile = (profileData) => API.put(`/profile/edit-profile`, profileData);
