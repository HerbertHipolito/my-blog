const path = require('path');
const htmlTags = require('../model/htmlTags');
const users = require('../model/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

const getLoginController = async (req, res) => {

    if (req.session.authenticated) return res.redirect('/');

    const header = await htmlTags.findOne({tag:'header'});

    return res.render(path.join('..', 'views', 'login'), {
        header:header.code
    });

}

const postLoginController = async (req, res) => {

    try{

        if (!req.body?.inputId || !req.body?.inputPassword) throw Error('Input missing');

        const { inputId, inputPassword } = req.body

        const user = await users.findOne({ login: req.body.inputId });
        if (!user) throw Error('Login or password not found');
        const match = await bcrypt.compare(req.body.inputPassword, user.password);
        if (!match) throw Error('Login or password not found');

        req.session.authenticated = true;

        req.session.user = {
            "role": user.role,
            "login": user.login,
            "name":user.name,
        };

        return res.redirect('/');

    }catch(MessageError){

        const header = await htmlTags.findOne({tag:'header'});

        return res.render(path.join('..','views','login'),{
            header:header.code,
            error:MessageError
        })

    }

    
}

const logoutController = (req,res) =>{

    if(req.session.authenticated){
        req.session.destroy(
            (error)=>{
                res.clearCookie(process.env.DATABASE_NAME);
                return res.redirect('/');
            }
        )
    }else{
        console.log('You are not logged');
        return res.redirect('/');
    }

}

module.exports = {getLoginController,postLoginController,logoutController}