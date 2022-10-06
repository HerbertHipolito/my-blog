const router = require('express').Router()
const {getLoginController,postLoginController,logoutController} = require('../controllers/loginControllers');

router.get('/',getLoginController).post('/',postLoginController);

router.get('/logout',logoutController);

module.exports = router;