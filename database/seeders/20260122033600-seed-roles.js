'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        name: 'SUPER_ADMIN',
        description: 'Global system administrator with full access',
        is_active: true,
        is_deletable: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '7b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6e',
        name: 'SOCIETY_ADMIN',
        description: 'Administrator for a specific society',
        is_active: true,
        is_deletable: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
