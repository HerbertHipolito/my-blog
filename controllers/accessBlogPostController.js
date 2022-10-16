const path = require('path');
const blogs = require('../model/blog');
const tags = require('../model/htmlTags');
const {format} =  require('date-fns');
const fs = require('fs');
const comments = require('../model/comments');

const getBlogPostController = async (req,res) =>{

    if(!req.params?.id) return res.status(400).json({'message':'id not found'});

    const blog =  await blogs.findById(req.params.id);
    const blogComments =  await comments.find({blogId:req.params.id});
    var newDates = [];

    for(let i=0;i<blogComments.length;i++){
        newDates.push(`${format(blogComments[i].dataComment,'dd/MM/yyyy HH:mm:ss')}`)
    }

    if(!blog) return res.status(400).json({ 'message': 'blog not found'});
    
    let header_string = 'headerBlogPost';
    
    var logged = false;
    if(req.session.authenticated){
        header_string = 'headerLoggedBlogPost';
        logged = true
    } 

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
        paragraphs:paragraphs,
        logged:logged,
        blogComments:blogComments,
        newDates:newDates
    })
}

const postBlogPostController = async(req,res) =>{

    if(!req.session?.authenticated) return res.status(400).json({'message':'Log in to comment' });
    if(!req.params?.id) return res.status(400).json({'message':'id not found'});
    
    const blogId =  await blogs.findById(req.params.id);
    
    if(!req.body?.commentText) return res.status(400).json({'message':'comment not found'});
    
    const dateNow = `${format(new Date(),'MM/dd/yyyy HH:mm:ss')}`;

    const result = await comments.create({
        authorName:req.session.user.name,
        text:req.body.commentText,
        dataComment:dateNow,
        like:0,
        disLike:0,
        blogId:blogId.id
    })

    return res.status(200).redirect('/blog/'+req.params.id);

}

module.exports = {getBlogPostController,postBlogPostController};