import request from 'supertest';
import app from '../../src/app';

import truncate from '../util/truncate';
import factory from '../factories';

import UserHelper from '../util/helpers/UserHelper';

// # User
describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  // # Register
  it('should be able to register', async () => {
    const newUser = await factory.attrs('User');
    const response = await request(app)
      .post('/users')
      .send(newUser);
    expect(response.body).toHaveProperty('id');
  });

  // # Register - Validator
  it('should not be able to register without credentials', async () => {
    const response = await request(app).post('/users');
    expect(response.status).toBe(400);
  });

  // # Duplicated email
  it('should not be able to register with duplicated email', async () => {
    const user = await UserHelper.generate();
    const response = await request(app)
      .post('/users')
      .send({
        email: user.email,
        password: user.password,
      });
    expect(response.status).toBe(400);
  });

  // # Update
  it('should be able to update', async () => {
    const user = await UserHelper.generate();

    // update
    const response = await request(app)
      .put('/users')
      .send({
        name: 'New Name',
        email: 'daniofilho@test.com',
      })
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.body).toHaveProperty('id');
  });

  // # Update - Validator - empty fields
  it('should not be able to update with empty fields', async () => {
    const user = await UserHelper.generate();
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${user.token}`);
    expect(response.status).toBe(400);
  });

  // # Update - Validator - withoutoken
  it('should not be able to update with empty fields', async () => {
    const response = await request(app).put('/users');
    expect(response.status).toBe(401);
  });

  // # Update with duplicated email
  it('should not be able to update with existing email', async () => {
    const user = await UserHelper.generate();
    const newUser = await UserHelper.generate();

    // update
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        name: 'New Name',
        email: newUser.email,
      });

    expect(response.status).toBe(400);
  });

  // # Update password
  it('should be able to update password', async () => {
    const user = await UserHelper.generate();

    // update
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        name: 'New Name',
        email: user.email,
        oldPassword: user.password,
        password: 'newpassword',
        confirmPassword: 'newpassword',
      });

    expect(response.body).toHaveProperty('id');
  });

  // # Update with wrong old password
  it('should not be able to update password with wrong oldPassword', async () => {
    const user = await UserHelper.generate();

    // update
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        name: 'New Name',
        email: user.email,
        oldPassword: 'wrongPassword',
        password: 'newpassword',
        confirmPassword: 'newpassword',
      });

    expect(response.status).toBe(401);
  });
});
