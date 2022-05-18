const Sequelize = require('sequelize')
const db = require('../database.js')

const Prom = db.define('prom', {
    prom_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    prom_name: { type: Sequelize.STRING, allowNull: false },
    battalion: { type: Sequelize.STRING, allowNull: false }
}, { timestamps: false })

module.exports = Prom