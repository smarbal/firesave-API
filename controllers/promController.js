const db = require('../models/index');
const Prom = db.Prom;
const User = db.User;

exports.promList = async function (req, res) {
    if(!alert){         // Check if in alert mode and 
        attributes = ["firstname", "lastname", "service_number", "room"]
    }
    else attributes = ["firstname", "lastname", "service_number", "room", 'inside']
    
    await Prom.findAll({ include: [{model: User, attributes: attributes}, { model: User, as: 'manager' }] }) 
        .then(data => {
            
            console.log("All proms:", JSON.stringify(data, null, 2));
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

exports.promCreate = async (req, res) => {
    let prom = Prom.build({ prom_name: req.body.prom_name, battalion: req.body.battalion})
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
    
    if (req.params.prom_name) {
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
        if(!alert){         // Check if in alert mode and 
            attributes = ["firstname", "lastname", "service_number", "room"]
        }
        else attributes = ["firstname", "lastname", "service_number", "room", 'inside']
        await Prom.findOne({include: [{model: User, attributes: attributes}]},{ where: { prom_name: req.params.prom_name } })
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
        const user = await User.findOne({include: [Prom]},{ where: { service_number: req.body.service_number } })
        prom.addUser(user)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json({ message: err.message })
        })
    }
    else res.status(400).json({ message: 'Prom not found' })
}
exports.promRemoveUser = async function (req, res) {
    if (req.params.prom_name) {
        console.log(req.body.service_number)
        const prom = await Prom.findOne({ where: { prom_name: req.params.prom_name } })
        const user = await User.findOne({include: [Prom]},{ where: { service_number: req.body.service_number } })
        console.log(user)
        prom.removeUser(user)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json({ message: err.message })  //Bugged library, seems to have an error even though the user is deleted
        })
    }
    else res.status(400).json({ message: 'Prom not found' })
}