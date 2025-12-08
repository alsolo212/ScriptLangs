const request = require('supertest');
const app = require('./server');

test('should return Привіт, світ! on /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Привіт, світ!');
});