"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("admins", {
            admin_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            username: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true,
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("admins");
    },
};