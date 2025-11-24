import API from "./index";

// Get random or recommended artworks
export const getDiscover = () => API.get("/discover");
