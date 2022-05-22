const Sequelize = require('sequelize')
const sequelize = require('../database.js');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Prom = require('./promModel');
db.User = require('./userModel');

db.Prom.hasMany( db.User, { foreignKey: "prom_name" });
db.User.belongsTo( db.Prom, { foreignKey: "prom_name" });

db.Prom.belongsToMany( db.User, { as: 'manager', constraints: false, allowNull:true, defaultValue:null, through: "managers", foreignKey: 'prom_name', timestamps: false});
db.User.belongsToMany( db.Prom, { as: 'manager', constraints: false, allowNull:true, defaultValue:null, through: "managers", foreignKey: 'service_number' });


//db.User.hasOne(db.Prom, { as: 'Manager'});

// Creating all the tables defined in user
sequelize.sync({});

module.exports = db