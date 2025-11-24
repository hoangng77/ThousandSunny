import API from "./index";

export const getLibrary = () => API.get("/consumer/library");
export const addToLibrary = (contentData) =>
  API.post("/consumer/library", contentData);
export const removeFromLibrary = (contentId) =>
  API.delete(`/consumer/library/${contentId}`);

export const getFollowing = () => API.get("/consumer/following");
export const followArtist = (artistId) =>
  API.post(`/consumer/follow/${artistId}`);
export const unfollowArtist = (artistId) =>
  API.post(`/consumer/unfollow/${artistId}`);

