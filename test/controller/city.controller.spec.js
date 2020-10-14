// const app = require('../../server')

const app = require('../../server');
const request = require('supertest');

describe('sanity test', () => {
  it('base api should return 200 ok', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);
    const spec = response.body;
    expect(spec).toHaveProperty(
      'message',
      'Welcome to Frontend Social API! v1'
    );
  });
});

describe('city route', () => {
  it('/city?citySearchText=pune&country=IN should return only pune', async () => {
    const response = await request(app)
      .get('/city?citySearchText=pune&country=IN&limit=100&page=1')
      .expect('Content-Type', /json/)
      .expect(200);
    const spec = response.body;
    expect(spec.length).toBe(1);
    expect(spec[0].name.toLowerCase()).toBe('pune');
  });
  it('/city?country=IN should return multiple cities', async () => {
    const response = await request(app)
      .get('/city?country=IN&limit=100&page=1')
      .expect('Content-Type', /json/)
      .expect(200);
    const spec = response.body;
    expect(spec.length).toBeGreaterThan(1);
  });
});
