import request from 'supertest';
import { subDays } from 'date-fns';
import factory from '../factories';
import truncate from '../util/truncate';

import app from '../../src/app';

import Meetup from '../../src/app/models/Meetup';

import UserHelper from '../util/helpers/UserHelper';
import MeetupHelper from '../util/helpers/MeetupHelper';
import FileHelper from '../util/helpers/FileHelper';

describe('Subscription', () => {
  beforeEach(async () => {
    await truncate();
  });

  // # Index
  it('should be able to list subscriptions', async () => {
    const meetup = await MeetupHelper.generate();
    const response = await request(app)
      .get('/subscriptions')
      .set('Authorization', `Bearer ${meetup.user.token}`);

    expect(response.status).toBe(200);
  });

  // # Index cached
  it('should be able to list subscriptions cached', async () => {
    const meetup = await MeetupHelper.generate();
    await request(app)
      .get('/subscriptions')
      .set('Authorization', `Bearer ${meetup.user.token}`);

    const response = await request(app)
      .get('/subscriptions')
      .set('Authorization', `Bearer ${meetup.user.token}`);

    expect(response.status).toBe(200);
  });

  // # Subscribe
  it('should be able to subscribe to a meetup', async () => {
    const meetup = await MeetupHelper.generate();
    const newUser = await UserHelper.generate();

    // subscribre
    const response = await request(app)
      .post('/subscriptions')
      .send({ meetup_id: meetup.id })
      .set('Authorization', `Bearer ${newUser.token}`);

    expect(response.body).toHaveProperty('id');
  });

  // # Subscribe empty fields
  it('should not be able to subscribe to a meetup without sending meetup id', async () => {
    const user = await UserHelper.generate();
    const response = await request(app)
      .post('/subscriptions')
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(400);
  });

  // # Subscribe without token
  it('should not be able to subscribe to a meetup without sending token', async () => {
    // Meetup
    const response = await request(app).post('/subscriptions');

    expect(response.status).toBe(401);
  });

  // # Subscribe meetup not exist
  it('should not be able to subscribe to inexistent meetup', async () => {
    const user = await UserHelper.generate();
    const response = await request(app)
      .post('/subscriptions')
      .send({ meetup_id: 9999999999999 })
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(500);
  });

  // # Subscribe own meetup
  it('should not be able to subscribe own meetup', async () => {
    const meetup = await MeetupHelper.generate();
    const response = await request(app)
      .post('/subscriptions')
      .send({ meetup_id: meetup.id })
      .set('Authorization', `Bearer ${meetup.user.token}`);

    expect(response.status).toBe(500);
  });

  // # Subscribe past meetup
  it('should not be able to subscribe a past meetup', async () => {
    const user = await UserHelper.generate();

    // Force Meetup creation with past date
    const file = await FileHelper.generate();
    const meetupData = await factory.attrs('Meetup', {
      file_id: file.id,
      date: subDays(new Date(), 2),
    });

    const user_id = file.user.id;
    const oldMeetup = await Meetup.create({
      ...meetupData,
      user_id,
    });

    // subscribe
    const response = await request(app)
      .post('/subscriptions')
      .send({ meetup_id: oldMeetup.id })
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(500);
  });

  // # Subscribe already subscribed meetup
  it('should not be able to subscribe same meetup twice', async () => {
    const meetup = await MeetupHelper.generate();
    const newUser = await UserHelper.generate();

    // subscribre
    await request(app)
      .post('/subscriptions')
      .send({ meetup_id: meetup.id })
      .set('Authorization', `Bearer ${newUser.token}`);

    // Subscribe again
    const response = await request(app)
      .post('/subscriptions')
      .send({ meetup_id: meetup.id })
      .set('Authorization', `Bearer ${newUser.token}`);

    expect(response.status).toBe(500);
  });

  // # Subscribe meetup same date meetup subscribed
  it('should not be able to subscribe two meetups at same time', async () => {
    const meetup = await MeetupHelper.generate();

    // another meetup
    const file = await FileHelper.generate();
    const meetupData = await factory.attrs('Meetup', {
      file_id: file.id,
      date: meetup.date,
    });

    const user_id = file.user.id;
    const secongMeetup = await Meetup.create({
      ...meetupData,
      user_id,
    });

    // new user
    const newUser = await UserHelper.generate();

    // Subscribe first meetup
    await request(app)
      .post('/subscriptions')
      .send({ meetup_id: meetup.id })
      .set('Authorization', `Bearer ${newUser.token}`);

    // Subscribe on same date
    const response = await request(app)
      .post('/subscriptions')
      .send({ meetup_id: secongMeetup.id })
      .set('Authorization', `Bearer ${newUser.token}`);

    expect(response.status).toBe(500);
  });

  // # Delete
  it('should be able to delete subscription', async () => {
    const meetup = await MeetupHelper.generate();
    const newUser = await UserHelper.generate();

    // subscribre
    const resSubscribe = await request(app)
      .post('/subscriptions')
      .send({ meetup_id: meetup.id })
      .set('Authorization', `Bearer ${newUser.token}`);

    // Delete
    const response = await request(app)
      .delete(`/subscriptions/${resSubscribe.body.id}`)
      .set('Authorization', `Bearer ${newUser.token}`);

    expect(response.status).toBe(200);
  });

  // # Delete not authorized
  it('should not be able to delete another user subscription', async () => {
    const meetup = await MeetupHelper.generate();
    const newUser = await UserHelper.generate();

    // subscribre
    const resSubscribe = await request(app)
      .post('/subscriptions')
      .send({ meetup_id: meetup.id })
      .set('Authorization', `Bearer ${newUser.token}`);

    // Delete
    const response = await request(app)
      .delete(`/subscriptions/${resSubscribe.body.id}`)
      .set('Authorization', `Bearer ${meetup.user.token}`);

    expect(response.status).toBe(401);
  });
});
