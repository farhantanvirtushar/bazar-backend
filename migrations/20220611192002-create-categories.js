"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("categories", {
            category_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            department_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: "departments",
                    key: "department_id",
                },
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            image_url: {
                type: Sequelize.STRING,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("categories");
    },
};