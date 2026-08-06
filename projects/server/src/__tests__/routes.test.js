const request = require('supertest');
const app = require('../index');

describe('API routes', () => {
  it('GET /api/greetings returns 200', async () => {
    const res = await request(app).get('/api/greetings');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Hello, Student !');
  });

  it('returns 404 JSON for unknown api routes', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.isError).toBe(true);
  });

  describe('state-changing routes use safe methods', () => {
    it('GET /api/products/add is not a GET route (was converted to POST)', async () => {
      const res = await request(app).get('/api/products/add');
      expect(res.status).toBe(404);
      expect(res.body.isError).toBe(true);
    });

    it('POST /api/transaction/confirmOrder is not a POST route (was converted to PATCH)', async () => {
      const res = await request(app).post('/api/transaction/confirmOrder');
      expect(res.status).toBe(404);
      expect(res.body.isError).toBe(true);
    });
  });

  describe('protected routes reject missing token before touching the DB', () => {
    it('POST /api/products/add', async () => {
      const res = await request(app).post('/api/products/add');
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Token not found');
    });

    it('GET /api/products/Cart', async () => {
      const res = await request(app).get('/api/products/Cart');
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Token not found');
    });

    it('PATCH /api/transaction/confirmOrder', async () => {
      const res = await request(app).patch('/api/transaction/confirmOrder');
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Token not found');
    });
  });
});
