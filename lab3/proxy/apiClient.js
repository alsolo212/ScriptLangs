const axios = require('axios');
const config = require('./config');

const apiClient = axios.create({
    baseURL: config.get('apiUrl'),
    timeout: 5000
});

module.exports = apiClient;