import { api } from "./api";

export async function listServicePosts({
  page = 1,
  size = 12,
  sortBy = "CREATED_AT",
  direction = "DESC",
  query = "",
} = {}) {
  const payload = {
    page,
    size,
    sortBy,
    direction,
  };

  if (query && query.trim().length > 0) {
    payload.query = query.trim();
  }

  const { data } = await api.post("/api/service-post/all", payload);
  return data;
}

export async function createServicePost(payload) {
  const { data } = await api.post("/api/service-post", payload);
  return data;
}

export async function uploadPhotosOnly(files) {
  if (!files || files.length === 0) return [];
  
  console.log('📸 Subiendo fotos:', files.length, 'archivos');
  
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:8080/api/service-post/photos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error(`Error uploading photos: ${response.statusText}`);
  }
  
  const urls = await response.json(); // Ya retorna array de URLs
  console.log('✅ URLs obtenidas:', urls);
  return urls;
}

export async function uploadServicePostPhoto(file, servicePostId) {
  const formData = new FormData();
  formData.append('files', file);  // ← Importante: 'files' (plural)
  formData.append('servicePostId', servicePostId);
  
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:8080/api/service-post/servicepost-photos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // NO incluir Content-Type para FormData
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Error uploading photo');
  }
  
  const urls = await response.json();
  return urls[0]; // Retorna la primera URL
}


