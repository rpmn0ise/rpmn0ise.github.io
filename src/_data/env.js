module.exports = {
  isDev: process.env.NODE_ENV !== "production",
  isProd: process.env.NODE_ENV === "production",
  env: process.env.NODE_ENV || "development",
};
