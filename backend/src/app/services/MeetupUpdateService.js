import { isBefore, parseISO } from 'date-fns';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

import Cache from '../../lib/Cache';

class MeetupUpdateService {
  async run({ user_id, meetup_id, data }) {
    const cacheKey = `user:${user_id}:meetups`;

    // # Check if user is the creator of the meetup
    const meetup = await Meetup.findByPk(meetup_id);

    if (meetup.user_id !== user_id) {
      throw new Error(`Not authorized.`);
    }

    // # Check if meetup has already happened
    if (isBefore(meetup.date, new Date())) {
      throw new Error(
        `Meetup has already happened, you can't update it anymore`
      );
    }

    // # Check if new date is in past
    if (isBefore(parseISO(data.date), new Date())) {
      throw new Error(`Meetup date invalid`);
    }

    if (meetup.past) {
      throw new Error(`Can't update past meetups.`);
    }

    // # Update
    await meetup.update(data);

    // # Clear Meetup Cache
    await Cache.invalidate('meetups');
    await Cache.invalidatePrefix(cacheKey);

    const meetupUpdated = await Meetup.findOne({
      where: { id: meetup_id },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return meetupUpdated;
  }
}

export default new MeetupUpdateService();
