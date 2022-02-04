'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert(
        "users",
        [
        {
            email: "fahrul@mail.com",
            phone: "089878767654",
            password:
            "$2b$10$7KXa8ANtY3dRTEM3TtOEQeTAFgGhmgnfXxYS8O/TgpD95z96wWL9q", //123456
            fullName: "fahrul ihsan",
        },
        ],
        {}
    );
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
