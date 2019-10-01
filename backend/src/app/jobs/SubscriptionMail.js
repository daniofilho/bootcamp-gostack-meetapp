import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, subscriber } = data;
    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}`,
      subject: 'Um usuário se inscreveu em seu Meetup',
      template: 'subscription',
      context: {
        meetup_creator_name: meetup.User.name,
        meetup_name: meetup.title,
        meetup_date: format(
          parseISO(meetup.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        subscriber_name: subscriber.name,
        subscriber_email: subscriber.email,
      },
    });
  }
}

export default new SubscriptionMail();
