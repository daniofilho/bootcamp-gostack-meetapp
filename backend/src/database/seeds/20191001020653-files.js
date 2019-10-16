module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'files',
      [
        {
          id: 1,
          name: 'example.png',
          path: '00797e6ef1da4a80d2a08660b2f34499.png',
          updated_at: new Date(),
          created_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('files', null, {});
  },
};
