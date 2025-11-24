import API from "./index";

export const registerUser =  (userInfo) => API.post("/auth/register", userInfo);
export const loginUser = (userInfo) => API.post("/auth/login", userInfo);
export const logoutUser = () => API.post("/auth/logout");