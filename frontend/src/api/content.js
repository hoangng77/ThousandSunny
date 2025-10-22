import API from "./index";

export const uploadMedia = (content) => API.post("/artist/content", content);
export const updateMedia = (id, content) => API.put(`/artist/content/${id}`, content);
export const deleteMedia = (id) => API.delete(`/artist/content/${id}`);
export const getPortfolio = (artist_id) => API.get(`/artist/portfolio/${artist_id}`);
export const getDashboard = () => API.get("/artist/dashboard");
export const getProfilePage = (username) => API.get(`/profilePage/${username}`);