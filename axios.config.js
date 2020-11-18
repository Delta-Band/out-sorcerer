import axios from 'axios';

const _axios = axios.create({
  baseURL: 'https://api.trello.com/1/',
  timeout: 5000,
  params: {
    key: process.env.TRELLO_API_KEY
  }
});

export default _axios;
