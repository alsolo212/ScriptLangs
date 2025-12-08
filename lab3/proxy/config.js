const convict = require('convict');
require('dotenv').config();

const config = convict({
    apiUrl: {
        doc: 'URL API сервера',
        format: String,
        default: 'http://localhost:4000',
        env: 'API_URL'
    },
    proxyPort: {
        doc: 'Порт proxy сервера',
        format: 'port',
        default: 3001,
        env: 'PROXY_PORT'
    }
});

module.exports = config;