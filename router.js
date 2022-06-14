
let express = require('express');
let router = express.Router();

// Import user controller
const userController = require('./controllers/userController');
const promController = require('./controllers/promController');
const authController = require('./controllers/authController');

router.post('/register', userController.userCreate)
router.post('/login', authController.login)

router.get('/user', authController.isAdmin,userController.userList);
router.put('/user/:service_number', authController.isUser, userController.userUpdate);
router.put('/inside/:service_number', authController.isUser,userController.userUpdateInside);
router.delete('/user/:service_number', authController.isUser, userController.userDelete); // isAdmin can also be possible
router.get('/user/find/:service_number', authController.isUser, userController.userFindOne)
//router.get('/user/filter', userController.userFindOp);
router.get('/user/order', userController.userOrder);


router.get('/prom', authController.isAdmin,promController.promList);
router.post('/prom', authController.isAdmin, promController.promCreate)
router.put('/prom/:prom_name', authController.isAdmin, promController.promUpdate); 

router.put('/promAdd/:prom_name', authController.isManager, promController.promAddUser);
router.put('/promRemove/:prom_name', authController.isManager, promController.promRemoveUser);

router.delete('/prom/:prom_name', authController.isAdmin ,promController.promDelete);

router.get('/prom/find/:prom_name', promController.promFindOne);


module.exports = router;
