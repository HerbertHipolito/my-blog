const {rootController}  = require('../controllers/rootController');
const router = require('express').Router();
const {getBlogPostController,postBlogPostController} = require('../controllers/accessBlogPostController');

router.get('/',rootController);
router.get('/blog/:id',getBlogPostController).post('/blog/:id',postBlogPostController);

module.exports = router;

