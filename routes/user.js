const router = require('express').Router()

const uploadImage = require('../middlewares/uploadImage');
const {getNewBlogController,postNewBlogController} = require('../controllers/newBlogConcontroller');
const {isAuthUser} = require('../middlewares/auth');

router.get('/newBlog',isAuthUser,getNewBlogController).post('/newBlog',uploadImage.single('inputImage'),postNewBlogController);


module.exports = router;