import request from 'supertest';
import { resolve } from 'path';
import truncate from '../util/truncate';
import factory from '../factories';

import app from '../../src/app';

import UserHelper from '../util/helpers/UserHelper';

describe('File', () => {
  beforeEach(async () => {
    await truncate();
  });

  // # Expected behavior
  it('should be able to add a File', async () => {
    const user = await UserHelper.generate();
    const file = await factory.attrs('File');

    const response = await request(app)
      .post('/files')
      // token
      .set('Authorization', `Bearer ${user.token}`)
      // simulating a file
      .attach('file', file.path);

    expect(response.body).toHaveProperty('id');
  });

  // # Wrong file type
  it('should return error when uploading wrong file type', async () => {
    const user = await UserHelper.generate();
    const response = await request(app)
      .post('/files')
      // token
      .set('Authorization', `Bearer ${user.token}`)
      // simulating a file
      .attach('file', `${resolve(__dirname, '..', 'assets')}/wrong-file.txt`);

    expect(response.status).toBe(500);
  });

  // # No file uploaded
  it('should not be able to do anything if no file sent', async () => {
    const user = await UserHelper.generate();
    const response = await request(app)
      .post('/files')
      // token
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(400);
  });

  // # Create - withoutoken
  it('should not be able to create file without token', async () => {
    const response = await request(app).post('/files');
    expect(response.status).toBe(401);
  });
});
