import * as Yup from 'yup';
import { isBefore } from 'date-fns';

import Subscription from '../models/Subscription';
import User from '../models/User';
import Meetup from '../models/Meetup';

class SubscriptionController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);

    // # Basic validation
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // # Meetup info
    const meetup = await Meetup.findByPk(req.body.meetup_id, {
      include: [User],
    });
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup does not exist' });
    }

    // # Check if it's not the creator
    if (meetup.user_id === user.id) {
      return res
        .status(400)
        .json({ error: "You can't subscribe to your own Meetup" });
    }

    // # check past meetup
    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: "Meetup has already happened, you can't subscribe anymore ",
      });
    }

    // # check if it's already subscribed

    // # check if it's not subscribing on 2 meetups at same time
    const hasAnotherMeetupOnDate = await Subscription.findOne({
      where: {
        user_id: user.id,
        include: [
          {
            model: Meetup,
            required: true,
            where: {
              date: meetup.date,
            },
          },
        ],
      },
    });
    return res.json(hasAnotherMeetupOnDate);
    if (hasAnotherMeetupOnDate) {
      return res.status(400).json({
        error: 'You have already subscribed to a meetup on this date',
      });
    }

    // # Send email
    // . . . todo

    // # Subscribe
    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    return res.json(subscription);
  }
}
export default new SubscriptionController();
