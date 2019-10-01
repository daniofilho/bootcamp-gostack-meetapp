import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

import Cache from '../../lib/Cache';

class MeetupIndexService {
  async run({ user_id, date = null, page }) {
    // # Basic list if no date param - All Meetups from user
    if (!date) {
      // # Cache
      const cacheKey = `user:${user_id}:meetups:${page}`;
      const cached = await Cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const meetups = await Meetup.findAll({
        where: { user_id },
        include: [
          {
            model: User,
          },
          {
            model: File,
            attributes: ['id', 'path', 'url'],
          },
        ],
      });

      // set cache
      await Cache.set(cacheKey, meetups);

      return meetups;
    }

    // # Advanced list - All Meetups
    const resultsPerPage = 2;

    // # Cache
    const cached = await Cache.get('meetups');
    if (cached) {
      return cached;
    }

    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parseISO(date)), endOfDay(parseISO(date))],
        },
      },
      limit: resultsPerPage,
      offset: (page - 1) * resultsPerPage,
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

    // set cache
    await Cache.set('meetups', meetups);

    return meetups;
  }
}

export default new MeetupIndexService();
