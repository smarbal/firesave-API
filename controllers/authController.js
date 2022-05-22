const bcrypt = require("bcrypt");
const db = require('../models/index');
const jwt = require('jsonwebtoken');
require('dotenv').config();
var _ = require('lodash');

const User = db.User;
const Prom = db.Prom;


async function verifyToken(req, res, next){
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_PASSWORD);
    console.log(decoded)
    let user = await User.findOne({ where: { service_number: decoded.service_number } })
    return user
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

exports.isAdmin = async (req, res, next) => {   

  user = await verifyToken(req, res, next);

  if(user.isAdmin){
    return next();
  }
  else{
    return res.status(401).send("User is not admin");
  }
  
};
exports.isUser = async (req, res, next) => {    //For functions that only the user himself can change

  const service_number = req.body.service_number || req.params.service_number

  
  user = await verifyToken(req, res, next);
  
  if(user.service_number == service_number){
    return next();
  }
  else{
    return res.status(401).send("User is not himself");
  }
  
};

exports.isManager = async (req, res, next) => {   
  const prom_name = req.body.prom_name || req.params.prom_name

  if (!prom_name) {
    return res.status(403).send("Specify the prom");
  }

  user = await verifyToken(req, res, next);
  prom = await Prom.findOne({ include: [{ model: User, as: 'manager' }] },{where: { prom_name: req.params.prom_name }})
  console.log(prom.manager)
  if(prom.manager.some(el => el.service_number === user.service_number)){
    return next();
  }
  else{
    return res.status(401).send("User is not manager");
  }
  
};

exports.login = async (req, res) => {
  let user = await User.findOne({ where: { username: req.body.username } });
  if (user === null) {
    res.status(401).send("User not found")
  } else {
    let result = bcrypt.compareSync(req.body.password, user.password)

    if (result) {
      let privateKey = process.env.JWT_PASSWORD;
      let token = jwt.sign({service_number: user.service_number}, privateKey);
      var saveableUser = _.pick(user, ['service_number', 'lastname', 'firstname', 'username', 'room', 'inside','prom_name', 'isAdmin']);
      console.log("User:", JSON.stringify(saveableUser, null, 2));
      res.send({ "token": token, "user": saveableUser });
    }

    else {
      res.status(401).send("Can't log you in !")
    }
  }
}