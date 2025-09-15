// src/services/services.js
import { api } from "./apiClient";

export const ServicesApi = {
  async list({ page = 1, limit = 12 } = {}) {
    // Ajustá la ruta y los nombres de query params según tu Swagger
    const { data } = await api.get("/services", { params: { page, limit } });
    return data; // idealmente { items: [], total: 123 }
  },
};
