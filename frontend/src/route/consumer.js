import API from "./index";

export const getLibrary = () => API.get(`/consumer/library`);
export const addToLibrary = (contentId) => API.post(`/consumer/library/${contentId}`);
export const removeFromLibrary = (contentId) => API.delete(`/consumer/library/${contentId}`);

export const getFollowing = () => API.get("/consumer/following");
export const followArtist = (artistId) => API.post(`/consumer/following/${artistId}`);
export const unfollowArtist = (artistId) => API.delete(`/consumer/following/${artistId}`);

