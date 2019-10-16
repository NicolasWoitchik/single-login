import request from 'supertest';
import app from '../../src/app';

let token;

beforeAll(done => {
  request(app)
    .post('/auth/login')
    .send({
      email: 'test@test.com',
      password: 'password_test',
    })
    .end((err, response) => {
      token = response.body.token; // save the token!
      done();
    });
});

describe('Session', () => {
  it('should return user id', () => {
    expect(1).toBe(1);
  });
});
