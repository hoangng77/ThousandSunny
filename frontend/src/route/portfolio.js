import API from "./index";
// Portfolio Routes
export const getPortfolio = (username) => API.get(`/portfolio/${username}`);
export const updatePortfolio = (data) => API.put("/portfolio/edit-portfolio", data);