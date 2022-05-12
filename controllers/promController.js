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
    if (req.params.prom_id > 0) {
        await Prom.update(
            { name: req.body.name, battalion: req.body.battalion, managerServiceNumber: req.body.managerServiceNumber },
            { where: { prom_id: req.params.prom_id } }
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
    if (req.params.prom_id) {
        await Prom.destroy({ where: { prom_id: req.params.prom_id } })
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
    if (req.params.prom_id) {
        await Prom.findOne({ where: { prom_id: req.params.prom_id } })
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
    if (req.params.prom_id) {
        const prom = await Prom.findOne({ where: { prom_id: req.params.prom_id } })
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
    if (req.params.prom_id) {
        const prom = await Prom.findOne({ where: { prom_id: req.params.prom_id } })
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