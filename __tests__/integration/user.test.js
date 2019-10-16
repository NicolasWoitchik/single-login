import request from 'supertest';
import app from '../../src/app';

describe('User', () => {
  it('should create user', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        first_name: 'test',
        last_name: 'test',
        email: 'test@test.com',
        pass: 'password_test',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should error first_name user', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        last_name: 'test',
        email: 'test@test.com',
        pass: 'password_test',
      });

    expect(response.status).toBe(401);
  });
});
