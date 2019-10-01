import { isBefore } from 'date-fns';

import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import User from '../models/User';

import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';

import Cache from '../../lib/Cache';

class SubscriptionStoreService {
  async run({ user_id, data }) {
    // # Cache
    const cacheKey = `user:${user_id}:subscriptions`;

    const user = await User.findByPk(user_id);

    // # Meetup info
    const meetup = await Meetup.findByPk(data.meetup_id, {
      include: {
        model: User,
      },
    });
    if (!meetup) {
      throw new Error(`Meetup does not exist`);
    }

    // # Check if it's not the creator
    if (meetup.user_id === user.id) {
      throw new Error(`You can't subscribe to your own Meetup`);
    }

    // # Check past meetup
    if (isBefore(meetup.date, new Date())) {
      throw new Error(
        `Meetup has already happened, you can't subscribe anymore`
      );
    }

    // # check if it's already subscribed
    const isAlreadySubscribed = await Subscription.findOne({
      where: { user_id: user.id, meetup_id: meetup.id },
    });
    if (isAlreadySubscribed) {
      throw new Error(`You have already subscribed to this meetup`);
    }

    // # check if it's not subscribing on 2 meetups at same time
    const hasAnotherMeetupOnDate = await Subscription.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (hasAnotherMeetupOnDate) {
      throw new Error(`You have already subscribed to a meetup on this date`);
    }

    // # Send email
    Queue.add(SubscriptionMail.key, {
      meetup,
      subscriber: user,
    });

    // # Subscribe
    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    // # Clear cache
    await Cache.invalidatePrefix(cacheKey);

    return subscription;
  }
}

export default new SubscriptionStoreService();
