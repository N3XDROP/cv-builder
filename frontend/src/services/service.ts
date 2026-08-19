import type { CVData } from "../types/cv";

const API_URL = "http://localhost:4000/api/cvs";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getCV = async (): Promise<CVData | null> => {
  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo obtener el CV");
  }

  return result.data;
};

export const saveCV = async (cv: CVData) => {
  const response = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(cv),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo guardar el CV");
  }

  return result;
};
