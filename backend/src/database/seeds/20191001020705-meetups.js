const faker = require('faker');

faker.locale = 'pt_BR';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'meetups',
      [
        {
          user_id: 1,
          title: `Primeiro Meetup de ${faker.name.jobTitle()}`,
          description: faker.lorem.sentence(),
          location: `${faker.address.streetAddress()},
            ${faker.address.city()}
            - ${faker.address.state()}`,
          date: faker.date.future(2, new Date()),
          file_id: 1,
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
