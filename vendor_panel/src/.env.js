module.exports = {
  // server: "http://localhost:8000",
  server: "https://api-vencure.flamecloud.co.uk",
  recaptcha_SITE_KEY: "6LeJZ4caAAAAAIBn8LT8FfClxCHnDFPq7EDEKen6",
  config: {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  },
};
