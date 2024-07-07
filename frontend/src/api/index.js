import axios from "axios";

const url = "http://127.0.0.1:8000/api";

// This URL (url2) is for dummy api with the use of serve-json. Should not be included in staging
// There is a db.json for storing the data for this api.
const url2 = "http://localhost:4000/";

export const API = axios.create({ baseURL: url });

export const API2 = axios.create({ baseURL: url2 });
