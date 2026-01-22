'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('system_configs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      value: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Seed initial values
    await queryInterface.bulkInsert('system_configs', [
      {
        id: Sequelize.fn('gen_random_uuid'),
        key: 'maintenance_mode',
        value: JSON.stringify(false),
        description: 'Global maintenance mode toggle',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.fn('gen_random_uuid'),
        key: 'registration_enabled',
        value: JSON.stringify(true),
        description: 'Allow new society registrations',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('system_configs');
  },
};
