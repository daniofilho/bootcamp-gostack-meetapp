import request from 'supertest';
import factory from '../../factories';

import UserHelper from './UserHelper';

import app from '../../../src/app';

class FileHelper {
  constructor() {
    this.file = [];
  }

  get() {
    return this.file;
  }

  set(data) {
    this.file = data;
  }

  async generate() {
    const file = await factory.attrs('File');
    const user = await UserHelper.generate();

    const response = await request(app)
      .post('/files')
      // token
      .set('Authorization', `Bearer ${user.token}`)
      // simulating a file
      .attach('file', file.path);

    this.set({
      id: response.body.id,
      ...file,
      user,
    });

    return this.get();
  }
}

export default new FileHelper();
