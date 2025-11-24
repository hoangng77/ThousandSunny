import API from "./index";

export const uploadMedia = (data, isSeries = false) => {
  const endpoint = isSeries
    ? "/artist/upload-series"
    : "/artist/upload";

    return API.post(endpoint, data);
};

export const updateMedia = (id, data) =>
  API.put(`/artist/content/${id}`, data);

export const deleteMedia = (id) =>
  API.delete(`/artist/content/${id}`);

export const getPortfolio = () =>
  API.get("/artist/portfolio");

export const getProgress = () =>
  API.get("/artist/progress");

