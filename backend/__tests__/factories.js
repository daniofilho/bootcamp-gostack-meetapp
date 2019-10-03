import faker from 'faker';
import { factory } from 'factory-girl';

import { resolve } from 'path';
import User from '../src/app/models/User';
import File from '../src/app/models/File';
import Meetup from '../src/app/models/Meetup';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('File', File, {
  name: `${faker.lorem.word()}.jpg`,
  path: `${resolve(__dirname, 'assets')}/example.png`,
});

factory.define('Meetup', Meetup, {
  title: `Primeiro Meetup de ${faker.name.jobTitle()}`,
  description: faker.lorem.sentence(),
  location: `${faker.address.streetAddress()},
    ${faker.address.city()}
    - ${faker.address.state()}`,
  date: faker.date.future(2, new Date()),
  created_at: new Date(),
  updated_at: new Date(),
  // Must include:
  // file_id
  // user_id
});

export default factory;
