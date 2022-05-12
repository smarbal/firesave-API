const Sequelize = require('sequelize')
const sequelize = require('../database.js');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Prom = require('./promModel');
db.User = require('./userModel');

db.Prom.hasMany( db.User, { foreignKey: "prom_id" });
db.User.belongsTo( db.Prom, { foreignKey: "prom_id" });

db.Prom.belongsTo( db.User, { as: 'manager', constraints: false, allowNull:false, defaultValue:null });
db.User.hasOne( db.Prom, { as: 'manager', constraints: false, allowNull:true, defaultValue:null });


//db.User.hasOne(db.Prom, { as: 'Manager'});

// Creating all the tables defined in user
// db.sync();
sequelize.sync({force: true})

module.exports = db