import axios from "axios";

import config from "../../config";

export const instance = axios.create({
  baseURL: config.API_HOST,
  timeout: 20000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=utf-8",
  },
  validateStatus: null
});

export const fetcher = async (url) => {
  return await instance.get(url).then((res) => {
    const r = res.data;

    return r.data;
  });
};

export default instance;
