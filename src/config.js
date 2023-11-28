const base = {
  COOKIE_NAME: "kasirku",
  LAST_VISIT: "last-visit",
};

const development = (function () {
  let apiHost = "http://localhost:8181";

  if (import.meta.env.VITE_APP_API_HOST) {
    apiHost = import.meta.env.VITE_APP_API_HOST;
  }

  return {
    ...base,
    API_HOST: apiHost,
  };
})();

const production = {
  ...base,
  API_HOST: import.meta.env.VITE_APP_API_HOST,
};

const env = import.meta.env.VITE_APP_STAGE || "development";
export default env === "production" ? production : development;
