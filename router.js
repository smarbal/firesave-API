
let express = require('express');
let router = express.Router();

// Import user controller
const userController = require('./controllers/userController');
const promController = require('./controllers/promController');
const authController = require('./controllers/authController');

router.post('/register', userController.userCreate)

router.get('/user', userController.userList);
router.put('/user/:service_number', userController.userUpdate);
router.put('/inside/:service_number', userController.userUpdateInside);
router.delete('/user/:service_number', userController.userDelete);
router.get('/user/find/:service_number', userController.userFindOne)
//router.get('/user/filter', userController.userFindOp);
router.get('/user/order', userController.userOrder);


router.get('/prom', promController.promList);
router.post('/prom', promController.promCreate)
router.put('/prom/:prom_name', authController.isManager, promController.promUpdate); // router.put('/prom/:prom_id', authController.verifyToken,promController.promUpdate);

router.delete('/prom/:prom_name', promController.promDelete);
router.get('/prom/find/:prom_name', promController.promFindOne)

router.post('/login', authController.login)

module.exports = router;