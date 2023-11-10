import axios from "axios";

import config from "../../config";

export const instance = axios.create({
  baseURL: config.API_HOST,
  timeout: 20000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=utf-8",
  },
  validateStatus: function (status) {
    return status < 505; // Resolve only if the status code is less than 500
  },
});

export const fetcher = async (url) => {
  return await instance.get(url).then((res) => {
    const r = res.data;

    return r.data;
  });
};

export default instance;
