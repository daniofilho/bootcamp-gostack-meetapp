import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import User from '../models/User';
import File from '../models/File';

import Cache from '../../lib/Cache';

import SubscriptionStoreService from '../services/SubscriptionStoreService';

class SubscriptionController {
  async index(req, res) {
    // # Cache
    const cacheKey = `user:${req.userId}:subscriptions`;
    const cached = await Cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          required: true,
          where: {
            date: { [Op.gt]: new Date() }, // date > today
          },
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
        },
      ],
      order: [['meetup', 'date']],
    });

    // Set Cache
    await Cache.set(cacheKey, subscriptions);

    return res.json(subscriptions);
  }

  async store(req, res) {
    const subscription = await SubscriptionStoreService.run({
      user_id: req.userId,
      data: req.body,
    });

    return res.json(subscription);
  }

  async delete(req, res) {
    const user_id = req.userId;
    const subscription = await Subscription.findByPk(req.params.id);

    // # Check if user is the owner of subscription
    if (subscription.user_id !== user_id) {
      return res.status(401).json({ error: 'Not authorized.' });
    }

    // # Delete
    await subscription.destroy();

    return res.send();
  }
}
export default new SubscriptionController();
