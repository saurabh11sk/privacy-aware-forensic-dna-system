import api from "./api";   // adjust path if needed

export const submitFeedback = async (formData) => {
  const response = await api.post("/feedback", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getMyFeedback = async () => {
  const response = await api.get("/feedback/me");
  return response.data;
};
