const request = require('supertest');
const app = require('../server'); // Adjust if you export your Express app

describe('Auth API', () => {
  it('should register a user with valid data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});