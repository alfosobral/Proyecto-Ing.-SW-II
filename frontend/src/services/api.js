import axios from "axios";

// Simulación: si tuvieras backend, pondrías la URL real
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// Mock simple cuando no hay backend:
export async function getProfesionalesMock() {
  // simulamos latencia
  await new Promise((r) => setTimeout(r, 500));
  return [
    { id: 1, nombre: "Ana", profesion: "Psicóloga" },
    { id: 2, nombre: "Luis", profesion: "Electricista" },
  ];
}

export default api;
