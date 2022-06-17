"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("products", {
            product_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            category_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: "categories",
                    key: "category_id",
                },
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            image_url: {
                type: Sequelize.STRING,
            },

            price: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            buying_price: {
                type: Sequelize.DECIMAL,
                defaultValue: 0,
            },
            unit: {
                type: Sequelize.STRING,
            },
            stock: {
                type: Sequelize.DECIMAL,
                defaultValue: 0,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("products");
    },
};