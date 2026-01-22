'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('roles', 'roles_name_key');
    await queryInterface.addIndex('roles', ['name'], {
      unique: true,
      name: 'roles_name_unique_active',
      where: {
        deleted_at: null,
      },
    });

    await queryInterface.removeConstraint('admins', 'admins_email_key');
    await queryInterface.addIndex('admins', ['email'], {
      unique: true,
      name: 'admins_email_unique_active',
      where: {
        deleted_at: null,
      },
    });

    await queryInterface.removeConstraint('admins', 'admins_phone_number_key');
    await queryInterface.addIndex('admins', ['phone_number'], {
      unique: true,
      name: 'admins_phone_number_unique_active',
      where: {
        deleted_at: null,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('roles', 'roles_name_unique_active');
    await queryInterface.addConstraint('roles', {
      fields: ['name'],
      type: 'unique',
      name: 'roles_name_key',
    });

    await queryInterface.removeIndex('admins', 'admins_email_unique_active');
    await queryInterface.addConstraint('admins', {
      fields: ['email'],
      type: 'unique',
      name: 'admins_email_key',
    });

    await queryInterface.removeIndex('admins', 'admins_phone_number_unique_active');
    await queryInterface.addConstraint('admins', {
      fields: ['phone_number'],
      type: 'unique',
      name: 'admins_phone_number_key',
    });
  },
};
