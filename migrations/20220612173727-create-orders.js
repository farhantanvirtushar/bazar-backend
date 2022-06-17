"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("orders", {
            order_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: "users",
                    key: "user_id",
                },
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            shipping_address: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            shipping_city: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            shipping_zip_code: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            created_at: {
                allowNull: false,
                type: "TIMESTAMP",
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("orders");
    },
};