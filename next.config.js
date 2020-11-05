module.exports = {
  env: {
    TRELLO_API_KEY: process.env.TRELLO_API_KEY,
    TRELLO_API_TOKEN: process.env.TRELLO_API_TOKEN,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY
  },
  compress: false,
  optimization: {
    minimize: false
  }
};
