'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('residents');
    if (!tableDefinition.family_members) {
      await queryInterface.addColumn('residents', 'family_members', {
        type: Sequelize.JSONB,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('residents', 'family_members');
  },
};
