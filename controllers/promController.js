const db = require('../models/index');
const Prom = db.Prom;
const User = db.User;

exports.promList = async function (req, res) {
    await Prom.findAll({ include: [User] })
        .then(data => {
            console.log("All proms:", JSON.stringify(data, null, 2));
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

exports.promCreate = async (req, res) => {
    let prom = Prom.build({ name: req.body.name, battalion: req.body.battalion, managerServiceNumber: req.body.managerServiceNumber })
    await prom.save()
        .then(data => {
            console.log(prom.toJSON());
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
    // or user.create in one time
}

exports.promUpdate = async function (req, res) {
    if (req.params.prom_name > 0) {
        await Prom.update(
            { name: req.body.name, battalion: req.body.battalion, managerServiceNumber: req.body.managerServiceNumber },
            { where: { prom_name: req.params.prom_name } }
        )
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Prom not found' })
}

exports.promDelete = async function (req, res) {
    if (req.params.prom_name) {
        await Prom.destroy({ where: { prom_name: req.params.prom_name } })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Prom not found' })
}

exports.promFindOne = async function (req, res) {
    if (req.params.prom_name) {
        await Prom.findOne({include: [User]},{ where: { prom_name: req.params.prom_name } })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
    else res.status(400).json({ message: 'Prom not found' })
}


exports.promAddUser = async function (req, res) {
    if (req.params.prom_name) {
        const prom = await Prom.findOne({ where: { prom_name: req.params.prom_name } })
        prom.addUser({ where: { service_number: req.params.service_number } })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
    }
    else res.status(400).json({ message: 'Prom not found' })
}
exports.promRemoveUser = async function (req, res) {
    if (req.params.prom_name) {
        const prom = await Prom.findOne({ where: { prom_name: req.params.prom_name } })
        prom.removeUser({ where: { service_number: req.params.service_number } })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
    }
    else res.status(400).json({ message: 'Prom not found' })
}