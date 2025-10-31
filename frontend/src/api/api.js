import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const api = {
  // Countries
  getCountries: () => axios.get(`${API_BASE_URL}/countries`),
  createCountry: (data) => axios.post(`${API_BASE_URL}/countries`, data),

  // Contacts
  getContacts: () => axios.get(`${API_BASE_URL}/contacts`),
  createContact: (data) => axios.post(`${API_BASE_URL}/contacts`, data),
  updateContact: (id, data) => axios.put(`${API_BASE_URL}/contacts/${id}`, data),
  deleteContact: (id) => axios.delete(`${API_BASE_URL}/contacts/${id}`),
};
