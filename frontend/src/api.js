import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL || `${API_BASE_URL}`;


const API = axios.create({
 baseURL: `${API_BASE_URL}`
});

export const getFundTrace = (accountId) =>
 API.get(`/fund-trace/${accountId}`);