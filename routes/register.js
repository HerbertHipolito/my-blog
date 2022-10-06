const router = require('express').Router()
const {getRegisterController,postRegisterController} = require('../controllers/registerController');
const path =  require('path');

router.get('/',getRegisterController).post('/',postRegisterController);

module.exports = router
