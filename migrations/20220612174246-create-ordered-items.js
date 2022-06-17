"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ordered_items", {
            ordered_item_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            order_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: "orders",
                    key: "order_id",
                },
            },
            product_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: "products",
                    key: "product_id",
                },
            },

            quantity: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("ordered_items");
    },
};