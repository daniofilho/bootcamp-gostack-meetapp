import request from 'supertest';
import { subDays } from 'date-fns';
import factory from '../factories';
import truncate from '../util/truncate';

import app from '../../src/app';

import Meetup from '../../src/app/models/Meetup';

import UserHelper from '../util/helpers/UserHelper';
import FileHelper from '../util/helpers/FileHelper';
import MeetupHelper from '../util/helpers/MeetupHelper';

describe('Meetup', () => {
  beforeEach(async () => {
    await truncate();
  });

  // # index
  it('should be able to list own meetups', async () => {
    const meetup = await MeetupHelper.generate();

    const response = await request(app)
      .get('/meetups')
      .set('Authorization', `Bearer ${meetup.user.token}`);

    expect(response.body[0].id).toBe(meetup.id);
  });

  // # index
  it('should be able to list meetups by date', async () => {
    const user = await UserHelper.generate();
    const response = await request(app)
      .get('/meetups')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ date: new Date() });

    expect(response.status).toBe(200);
  });

  // # Create meetup
  it('should be able to create a meetup', async () => {
    const file = await FileHelper.generate();
    const meetup = await factory.attrs('Meetup', {
      file_id: file.id,
    });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${file.user.token}`)
      .send(meetup);

    expect(response.status).toBe(200);
  });

  // # Create - without token
  it('should not be able to create meetup without token', async () => {
    const response = await request(app).post('/meetups');
    expect(response.status).toBe(401);
  });

  // # Create - missing fields
  it('should not be able to create meetup with missing fields', async () => {
    const file = await FileHelper.generate();
    const meetup = await factory.attrs('Meetup', {
      file_id: file.id,
    });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${file.user.token}`)
      .send({
        title: meetup.title,
      });
    expect(response.status).toBe(400);
  });

  // # Create meetup with past date
  it('should not be able to create a meetup with past date', async () => {
    const file = await FileHelper.generate();
    const meetup = await factory.attrs('Meetup', {
      file_id: file.id,
      date: subDays(new Date(), 1),
    });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${file.user.token}`)
      .send(meetup);

    expect(response.status).toBe(400);
  });

  // # Update meetup
  it('should be able to update a meetup', async () => {
    const meetup = await MeetupHelper.generate();

    // Update
    const response = await request(app)
      .put(`/meetups/${meetup.id}`)
      .set('Authorization', `Bearer ${meetup.user.token}`)
      .send(meetup);

    expect(response.status).toBe(200);
  });

  // # Update meetup with missing fields
  it('should not be able to update a meetup with missing fields', async () => {
    const meetup = await MeetupHelper.generate();

    // Update
    const response = await request(app)
      .put(`/meetups/${meetup.id}`)
      .set('Authorization', `Bearer ${meetup.user.token}`)
      .send({
        title: meetup.title,
      });

    expect(response.status).toBe(400);
  });

  // # Update - without token
  it('should not be able to update meetup without token', async () => {
    // Meetup
    const meetup = await MeetupHelper.generate();

    const response = await request(app)
      .put(`/meetups/${meetup.id}`)
      .send(meetup);
    expect(response.status).toBe(401);
  });

  // # Update meetup with past date
  it('should not be able to update a meetup with past date', async () => {
    // generate
    const meetup = await MeetupHelper.generate();

    meetup.date = subDays(new Date(), 1);

    // Update
    const response = await request(app)
      .put(`/meetups/${meetup.id}`)
      .set('Authorization', `Bearer ${meetup.user.token}`)
      .send(meetup);

    expect(response.status).toBe(500);
  });

  // # Update meetup with not authorized user
  it('should not be able to update a meetup with not authorized user', async () => {
    // Not authorized used
    const wrongUser = await UserHelper.generate();

    // Meetup
    const meetup = await MeetupHelper.generate();

    // Update
    const response = await request(app)
      .put(`/meetups/${meetup.id}`)
      .set('Authorization', `Bearer ${wrongUser.token}`)
      .send(meetup);

    expect(response.status).toBe(500);
  });

  // # Delete meetup
  it('should be able to delete meetup', async () => {
    // Meetup
    const meetup = await MeetupHelper.generate();

    // Delete
    const response = await request(app)
      .delete(`/meetups/${meetup.id}`)
      .set('Authorization', `Bearer ${meetup.user.token}`);

    expect(response.status).toBe(200);
  });

  // # Delete - without token
  it('should not be able to delete meetup without token', async () => {
    // Meetup
    const meetup = await MeetupHelper.generate();

    const response = await request(app)
      .delete(`/meetups/${meetup.id}`)
      .send(meetup);
    expect(response.status).toBe(401);
  });

  // # Delete meetup not authorized
  it('should not be able to delete a meetup with not authorized user', async () => {
    // Not authorized used
    const wrongUser = await UserHelper.generate();

    // Meetup
    const meetup = await MeetupHelper.generate();

    // Update
    const response = await request(app)
      .delete(`/meetups/${meetup.id}`)
      .set('Authorization', `Bearer ${wrongUser.token}`);

    expect(response.status).toBe(401);
  });

  // # Delete past meetup
  it('should not be able to delete past meetup', async () => {
    // Force Meetup creation with past date
    const file = await FileHelper.generate();
    const meetupData = await factory.attrs('Meetup', {
      file_id: file.id,
      date: subDays(new Date(), 2),
    });

    const user_id = file.user.id;

    const meetup = await Meetup.create({
      ...meetupData,
      user_id,
    });

    // Delete
    const response = await request(app)
      .delete(`/meetups/${meetup.id}`)
      .set('Authorization', `Bearer ${file.user.token}`);

    expect(response.status).toBe(400);
  });
});
