'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('admins', 'society_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'societies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('admins', ['society_id'], {
      name: 'admins_society_id_index',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('admins', 'admins_society_id_index');
    await queryInterface.removeColumn('admins', 'society_id');
  },
};
