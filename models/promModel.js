const Sequelize = require('sequelize')
const db = require('../database.js')

const Prom = db.define('prom', {
    prom_name: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
    battalion: { type: Sequelize.STRING, allowNull: false }
}, { timestamps: false })

module.exports = Prom