const faker = require('faker');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async queryInterface => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: 1,
          name: faker.name.findName(),
          email: faker.internet.email(),
          password_hash: await bcrypt.hash(faker.internet.password(), 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: faker.name.findName(),
          email: faker.internet.email(),
          password_hash: await bcrypt.hash(faker.internet.password(), 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: faker.name.findName(),
          email: faker.internet.email(),
          password_hash: await bcrypt.hash(faker.internet.password(), 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          name: faker.name.findName(),
          email: faker.internet.email(),
          password_hash: await bcrypt.hash(faker.internet.password(), 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
