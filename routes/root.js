const {rootController}  = require('../controllers/rootController');
const router = require('express').Router();
const {getBlogPostController} = require('../controllers/accessBlogPostController');

router.get('/',rootController);
router.get('/blog/:id',getBlogPostController);

module.exports = router;

