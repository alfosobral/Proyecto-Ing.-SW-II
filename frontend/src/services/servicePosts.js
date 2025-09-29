import { api } from "./api";

export async function listServicePosts({
  page = 0,
  size = 12,
  sortBy = "CREATED_AT",
  direction = "DESC",
  query = "",
} = {}) {
  const params = {
    page,
    size,
    sortBy,
    direction,
  };

  if (query && query.trim().length > 0) {
    params.query = query.trim();
  }

  const { data } = await api.get("/api/servicepost/all", { params });
  return data;
}

export async function createServicePost(payload) {
  const { data } = await api.post("/api/servicepost", payload);
  return data;
}

export async function uploadServicePostPhoto(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/api/servicepost/photos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data?.url ?? null;
}


