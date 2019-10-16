import request from 'supertest';
import factory from '../../factories';

import FileHelper from './FileHelper';

import app from '../../../src/app';

class MeetupHelper {
  constructor() {
    this.file = [];
  }

  get() {
    return this.meetup;
  }

  set(data) {
    this.meetup = data;
  }

  async generate() {
    const file = await FileHelper.generate();
    const { token } = file.user;

    // Meetup
    const meetup = await factory.attrs('Meetup', {
      file_id: file.id,
    });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .send(meetup);

    this.set({
      ...response.body,
      user: file.user,
    });

    return this.get();
  }
}

export default new MeetupHelper();
