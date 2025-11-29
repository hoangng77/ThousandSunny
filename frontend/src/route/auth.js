import API from "./index";

export const registerUser =  (userInfo) => API.post("/auth/register", userInfo);
export const loginUser = (userInfo) => API.post("/auth/login", userInfo);