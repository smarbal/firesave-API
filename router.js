
let express = require('express');
let router = express.Router();

// Import user controller
const userController = require('./controllers/userController');
const promController = require('./controllers/promController');
const authController = require('./controllers/authController');

router.get('/user', userController.userList);
router.post('/user', userController.userCreate)
router.put('/user/:user_id', userController.userUpdate);
router.delete('/user/:user_id', userController.userDelete);
router.get('/user/find/:user_id', userController.userFindOne)
//router.get('/user/filter', userController.userFindOp);
router.get('/user/order', userController.userOrder);


router.get('/prom', promController.promList);
router.post('/prom', promController.promCreate)
router.put('/prom/:prom_id', promController.promUpdate); // router.put('/prom/:prom_id', authController.verifyToken,promController.promUpdate);

router.delete('/prom/:prom_id', promController.promDelete);
router.get('/prom/find/:prom_id', promController.promFindOne)

router.post('/login', authController.login)

module.exports = router;