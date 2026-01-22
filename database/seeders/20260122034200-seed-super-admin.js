'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    
    await queryInterface.bulkInsert('admins', [
      {
        id: '1b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a',
        role_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        first_name: 'System',
        last_name: 'Admin',
        email: 'admin@antigravity.com',
        phone_number: '1234567890',
        password: hashedPassword,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('admins', { email: 'admin@antigravity.com' }, {});
  },
};
