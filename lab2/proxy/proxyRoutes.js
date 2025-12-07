const express = require('express');
const { proxyRequest } = require('./proxyService');

const router = express.Router();

router.use('/', proxyRequest);

module.exports = router;