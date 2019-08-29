import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetuppController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
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

    return res.json(meetup);
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
