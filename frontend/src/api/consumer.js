import API from "./index";

// 📚 Library
export const getLibrary = () => API.get("/consumer/library");
export const addToLibrary = (contentData) =>
  API.post("/consumer/library", contentData);
export const removeFromLibrary = (contentId) =>
  API.delete(`/consumer/library/${contentId}`);

// 👤 Following
export const getFollowing = () => API.get("/consumer/following");
export const followArtist = (artistData) =>
  API.post("/consumer/following", artistData);
export const unfollowArtist = (artistId) =>
  API.delete(`/consumer/following/${artistId}`);
