'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('residents', 'flat_ids', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Array of property IDs linked to this resident',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('residents', 'flat_ids');
  },
};
