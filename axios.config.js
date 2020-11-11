import axios from 'axios';

const _axios = axios.create({
  baseURL: 'https://api.trello.com/1/',
  timeout: 1000,
  params: {
    key: process.env.TRELLO_API_KEY,
    token: process.env.TRELLO_API_TOKEN
  }
});

export default _axios;
