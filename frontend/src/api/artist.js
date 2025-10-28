import API from "./index";

// Upload a new media file
export const uploadMedia = (formData) =>
  API.post("/artist/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Update media info
export const updateMedia = (id, data) => API.put(`/artist/content/${id}`, data);

// Delete media
export const deleteMedia = (id) => API.delete(`/artist/content/${id}`);

// Get artist portfolio
export const getPortfolio = () => API.get("/artist/portfolio");
