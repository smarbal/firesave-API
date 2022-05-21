
const Sequelize = require('sequelize')
const db = require('../database.js')

const User = db.define('user', {
    service_number: {
        type: Sequelize.INTEGER,
        autoIncrement: false,
        allowNull: false,
        primaryKey: true
    },
    lastname: { type: Sequelize.STRING, allowNull: false },
    firstname: { type: Sequelize.STRING, allowNull: false },
    username: { type: Sequelize.STRING, allowNull: false },
    room: { type: Sequelize.STRING, allowNull: false }, 
    inside: {type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true},
    password: {type: Sequelize.STRING, allowNull: false},
    isAdmin: {type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false}
}, { timestamps: false })

module.exports = User