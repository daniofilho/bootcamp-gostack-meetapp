const faker = require('faker');
const factory = require('factory-girl');

const User = require('../app/models/User');
const Meetup = require('../app/models/Meetup');

faker.setLocale('pt_BR');

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

factory.define('Meetup', Meetup, {
  user_id: Math.floor(Math.random() * 3 + 1), // random numbers from 1 to 3
  title: `Primeiro Meetup ${faker.name.jobTitle}`,
  description: faker.lorem.sentence,
  location: `${faker.address.streetName} ${faker.address.streetAddress}, ${faker.address.city} - ${faker.address.state}`,
  date: faker.date.future,
  file_id: 1, // first image created
  createdAt: new Date(),
  updatedAt: new Date(),
});

export default factory;
