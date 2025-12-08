const apiClient = require('./apiClient');

async function proxyRequest(req, res) {
    try {
        const response = await apiClient({
            url: req.originalUrl,
            method: req.method,
            params: req.query,
            headers: {
                'user-agent': req.get('user-agent'),
                accept: req.get('accept')
            }
        });

        res.set(response.headers);
        res.status(response.status).send(response.data);

    } catch (err) {
        if (err.response) {
            res.status(err.response.status).send(err.response.data);
        } else {
            res.status(500).send('Error connecting to API');
        }
    }
}

module.exports = { proxyRequest };