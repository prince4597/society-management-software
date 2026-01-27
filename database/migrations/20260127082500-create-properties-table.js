'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('properties', {
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
      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      floor: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      block: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unit_type: {
        type: Sequelize.ENUM('1 BHK', '2 BHK', '3 BHK', 'Penthouse'),
        allowNull: false,
        defaultValue: '2 BHK',
      },
      occupancy_status: {
        type: Sequelize.ENUM('OWNER_OCCUPIED', 'RENTED', 'VACANT'),
        allowNull: false,
        defaultValue: 'VACANT',
      },
      maintenance_rule: {
        type: Sequelize.ENUM('DEFAULT_OWNER', 'CUSTOM_TENANT'),
        allowNull: false,
        defaultValue: 'DEFAULT_OWNER',
      },
      maintenance_status: {
        type: Sequelize.ENUM('PAID', 'DUE', 'OVERDUE'),
        allowNull: false,
        defaultValue: 'PAID',
      },
      owner_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'residents',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      tenant_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'residents',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      square_feet: {
        type: Sequelize.INTEGER,
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

    await queryInterface.addIndex('properties', ['society_id']);
    await queryInterface.addIndex('properties', ['owner_id']);
    await queryInterface.addIndex('properties', ['tenant_id']);
    await queryInterface.addIndex('properties', ['number', 'block', 'society_id'], { unique: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('properties');
  },
};
