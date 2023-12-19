import axios from "axios";
const BASE_URL = 'http://localhost:5001'

// Function for making POST requests with authentication.
export const postAPIAuth = async (url, body) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}/${url}`, body, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    });
    return response;
};

// Function for making GET request
export const getAPI = async (url) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/${url}`,{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};