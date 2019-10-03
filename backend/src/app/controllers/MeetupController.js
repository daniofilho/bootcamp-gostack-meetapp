import { isBefore, parseISO } from 'date-fns';

import Meetup from '../models/Meetup';

import Cache from '../../lib/Cache';

// # Services
import MeetupIndexService from '../services/MeetupIndexService';
import MeetupUpdateService from '../services/MeetupUpdateService';

class MeetupController {
  async index(req, res) {
    const { date, page = 1 } = req.query;

    const meetups = await MeetupIndexService.run({
      user_id: req.userId,
      date,
      page,
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const cacheKey = `user:${req.userId}:meetups`;

    // # Check if date is > today
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Meetup date invalid' });
    }

    // # Create
    const user_id = req.userId;
    const meetup = await Meetup.create({
      ...req.body,
      user_id,
    });

    // # Clear Meetup Cache
    await Cache.invalidate('meetups');
    await Cache.invalidatePrefix(cacheKey);

    return res.json(meetup);
  }

  async update(req, res) {
    const meetupUpdated = await MeetupUpdateService.run({
      user_id: req.userId,
      data: req.body,
      meetup_id: req.params.id,
    });

    return res.json(meetupUpdated);
  }

  async delete(req, res) {
    const user_id = req.userId;
    const meetup = await Meetup.findByPk(req.params.id);

    // # Check if user is the creator of the meetup
    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'Not authorized.' });
    }

    // # Check if meetup has already happened
    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: "Meetup has already happened, you can't change the past",
      });
    }

    // # Delete
    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupController();
