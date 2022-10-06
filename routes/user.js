const router = require('express').Router()

const uploadImage = require('../middlewares/uploadImage');
const {getNewBlogController,postNewBlogController} = require('../controllers/newBlogConcontroller');

router.get('/newBlog',getNewBlogController).post('/newBlog',uploadImage.single('inputImage'),postNewBlogController);


module.exports = router;