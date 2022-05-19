const bcrypt = require("bcrypt");
const db = require('../models/index');
const User = db.User;

exports.userList = async function (req, res) {
    await User.findAll()
        .then(data => {
            console.log("All users:", JSON.stringify(data, null, 2));
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

exports.userCreate = async function (req, res) {
    let hash = bcrypt.hashSync(req.body.password, 5)
    let user = User.create({ service_number: req.body.service_number, lastname: req.body.lastname, firstname: req.body.firstname,username: req.body.username , prom_name: req.body.prom_name, room: req.body.room, password: hash})
        .then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

exports.userUpdate = async function (req, res) {
    if (req.params.service_number > 0) {
        await User.update(
            { lastname: req.body.lastname, firstname: req.body.firstname, prom_id: req.body.prom_id, room: req.body.room  },
            { where: { service_number: req.params.service_number } }
        )
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'User not found' })
}

exports.userUpdateInside = async function (req, res) {
    if (req.params.service_number > 0) {
        await User.update(
            { inside: req.body.inside === 'true'},
            { where: { service_number: Number(req.params.service_number) } }
        )
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'User not found' })
}

exports.userDelete = async function (req, res) {
    if (req.params.service_number) {
        await User.destroy({ where: { service_number: req.params.service_number } })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'User not found' })
}

exports.userFindOne = async function (req, res) {
    if (req.params.service_number) {
        await User.findOne({ where: { service_number: req.params.service_number } })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'User not found' })
}

// const { Op } = require("sequelize");
// exports.userFindOp = async function (req, res) {
//     let params = {};
//     Object.entries(req.body).forEach(([key, value]) => {
//         params[key] = value;
//     });
//     await User.findAll({ where: params })
//         .then(data => {
//             res.json(data);
//         })
//         .catch(err => {
//             res.status(500).json({ message: err.message })
//         })
// }

exports.userOrder = async function (req, res) {
    await User.findAll({ order: ['inside'] })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}