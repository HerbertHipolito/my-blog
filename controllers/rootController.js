const path = require('path');
const htmlTags = require('../model/htmlTags');
const blogs = require('../model/blog');
const fs = require('fs')


function shuffleArray(array){

    var random_index = 0;

    for(let i = array.length-1; i>0;i--){
        
        random_index = Math.floor(Math.random()*(i+1));
        [array[i],array[random_index]]=[array[random_index],array[i]];

    }

    return array;

}

const rootController = async (req,res) =>{

    const body = await htmlTags.findOne({tag:'news-body-test'});
    let randomBlogs =  await blogs.find().limit(4);
    randomBlogs = shuffleArray(randomBlogs);

    let header = null;
    req.session.authenticated ? header = await htmlTags.findOne({tag:'headerLogged'}) : header = await htmlTags.findOne({tag:'header'});
    
    if(!body || !header) return res.status(400).json({'message':'error'});

    for (let i = 0;i<randomBlogs.length; i++){
        const pathImage = path.join(__dirname,'..','public','img')+'/'+randomBlogs[i].title+randomBlogs[i].image.contentType.replace('image/','.')
        fs.writeFileSync(pathImage,randomBlogs[i].image.data)
        randomBlogs[i].path = '/img/'+ randomBlogs[i].title + randomBlogs[i].image.contentType.replace('image/','.')
    }

    return res.render(path.join('..','views','firstPage'),{
        body:body.code,
        header:header.code,
        blogs:randomBlogs
    });

}

module.exports = {rootController}
