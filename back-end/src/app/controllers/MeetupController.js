import * as Yup from 'yup';
import { isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetuppController {
  async index(req, res) {
    const { date, page = 1 } = req.query;

    // Basic list if no date param - All Meetups from user
    if (!date) {
      const meetups = await Meetup.findAll({
        where: { user_id: req.userId },
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
      return res.json(meetups);
    }

    // Advanced list - All Meetups
    const resultsPerPage = 2;

    const meetups = await Meetup.findAll({
      where: {
        // user_id: req.userId,
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
    return res.json(meetups);
  }

  async store(req, res) {
    // # Basic validation
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

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

    return res.json(meetup);
  }

  async update(req, res) {
    const user_id = req.userId;

    // # Basic validation
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // # Check if user is the creator of the meetup
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'Not authorized.' });
    }

    // # Check if meetup has already happened
    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: "Meetup has already happened, you can't update it anymore ",
      });
    }

    // # Check if new date is in past
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Meetup date invalid' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: "Can't update past meetups." });
    }

    // # Update
    await meetup.update(req.body);

    const meetupUpdated = await Meetup.findOne({
      where: { id: req.params.id },
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
        error: "Meetup has already happened, you can't delete it anymore ",
      });
    }

    // # Delete
    await meetup.destroy();

    return res.send();
  }
}

export default new MeetuppController();
