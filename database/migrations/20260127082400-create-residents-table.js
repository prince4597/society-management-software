'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('residents', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      society_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'societies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('PRIMARY_OWNER', 'TENANT', 'FAMILY_MEMBER'),
        allowNull: false,
        defaultValue: 'TENANT',
      },
      is_resident: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      family_members: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      profile_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('residents', ['society_id']);
    await queryInterface.addIndex('residents', ['email', 'society_id'], { unique: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('residents');
  },
};
