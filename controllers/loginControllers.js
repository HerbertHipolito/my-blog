const path = require('path');
const htmlTags = require('../model/htmlTags');
const users = require('../model/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

const getLoginController = async (req, res) => {

    const tag = await htmlTags.findOne({ tag: 'login' });

    let header = null
    req.session.authenticated ? header = await htmlTags.findOne({tag:'headerLogged'}) : header = await htmlTags.findOne({tag:'header'});

    if (!tag) return res.status(400).json({ 'message': 'error' });

    return res.render(path.join('..', 'views', 'main'), {
        body: tag.code,
        header:header.code
    });

}

const postLoginController = async (req, res) => {

    if (!req.body?.inputId || !req.body?.inputPassword) return res.status(400).json({ 'message': 'Input missing' });

    const { inputId, inputPassword } = req.body

    const user = await users.findOne({ login: req.body.inputId });
    if (!user) return res.status(400).json({ 'message': 'Login or password not found' });
    const match = await bcrypt.compare(req.body.inputPassword, user.password);
    if (!match) return res.status(400).json({ 'message': 'Login or password not found' });

    req.session.authenticated = true;

    req.session.user = {
        "role": user.role,
        "login": user.login,
        "name":user.name,
    };

    return res.redirect('/');

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