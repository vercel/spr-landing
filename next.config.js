module.exports = {
  target: "serverless",
  experimental: {
    ampBindInitData: true
  },
  env: {
    DEV: process.env.NODE_ENV !== 'production',
  }
};
