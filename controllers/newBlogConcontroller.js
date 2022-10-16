const path = require('path');
const htmlTags = require('../model/htmlTags');
const blogs = require('../model/blog');
const {format} =  require('date-fns');
const fs = require('fs');

const getNewBlogController = async (req,res) =>{
    
    const body = await htmlTags.findOne({ tag: 'registerBlog' });
    const header = await htmlTags.findOne({ tag:'headerLoggedNewBlog' }); 

    if (!body || !header) return res.status(400).json({ 'message': 'error' });

    return res.render(path.join('..', 'views', 'main'), {
        body:body.code,
        header:header.code
    });

}

const postNewBlogController = async (req, res,next) => {

    //console.log(req.body,req.file);

    if(!req.body?.inputText || !req.body?.inputTitle || !req.file) return res.status(400).json({'message':'input missing'});

    const {inputText,inputTitle,inputTags,inputImage} = req.body

    const dateNow = `${format(new Date(),'MM/dd/yyyy HH:mm:ss')}`;

    const result = await blogs.create({
        'authorLogin':req.session.user.login,
        'title': inputTitle,
        'text': inputText,
        'dataPost':dateNow,
        'tags':inputTags,
        'image':{
            data:fs.readFileSync(path.join(__dirname,'..','uploads',req.file.filename)),
            contentType: 'image/png'
        }
    })

    return res.status(200).redirect('/');

}

module.exports = {getNewBlogController,postNewBlogController}