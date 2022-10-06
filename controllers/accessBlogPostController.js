const path = require('path');
const blogs = require('../model/blog');
const tags = require('../model/htmlTags');
const {format} =  require('date-fns');
const fs = require('fs');

const getBlogPostController = async (req,res) =>{

    if(!req.params?.id) return res.status(400).json({'message':'id not found'});

    const blog =  await blogs.findById(req.params.id);

    if(!blog) return res.status(400).json({ 'message': 'blog not found'});
    
    let header_string = 'headerBlogPost';
    
    if(req.session.authenticated) header_string = 'headerLoggedBlogPost';

    header = await tags.findOne({ tag:header_string });
    const body = await tags.findOne({ tag:'blogPost' });
    const data = `${format(blog.dataPost,'dd/MM/yyyy HH:mm:ss')}`;
    const paragraphs = blog.text.split('<br>');
    
    const pathImage = path.join(__dirname,'..','public','img')+'/'+blog.title+blog.image.contentType.replace('image/','.')
    fs.writeFileSync(pathImage,blog.image.data)
    const pathImageHtml = '/img/'+ blog.title + blog.image.contentType.replace('image/','.')

    res.render(path.join('..','views','blogPost'),{
        blog:blog,
        userName:blog.authorLogin, 
        header:header.code,
        body:body.code,
        data:data,
        pathImageHtml:pathImageHtml,
        paragraphs:paragraphs
    })
}

module.exports = {getBlogPostController};