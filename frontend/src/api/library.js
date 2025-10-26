import API from "./index";

export const searchMedia = (query) => API.get("/consumer/search", { params: { q: query } });
export const addToLibrary = (contentId) => API.post(`/consumer/library/${contentId}`);
export const removeFromLibrary = (contentId) => API.delete(`/consumer/library/${contentId}`);
export const changeVisibility = (visibility) => API.patch(`/consumer/library/${visibility}`);
export const updateProgress = (contentId, progress) => API.post(`/consumer/progress/${contentId}`, { progress });
export const postComment = (contentId, comment) => API.post(`/consumer/comments/${contentId}`, { comment });
export const editComment = (contentId, comment) => API.put(`/consumer/comments/${contentId}`, { comment });
export const deleteComment = (contentId) => API.delete(`/consumer/comments/${contentId}`);
export const followArtist = (artistId) => API.post(`/consumer/follow/${artistId}`);
export const unfollowArtist = (artistId) => API.put(`/consumer/follow/${artistId}`);
export const deleteFollow = (artistId) => API.delete(`/consumer/follow/${artistId}`);