const path = require('path');
const htmlTags = require('../model/htmlTags');
const users = require('../model/user');
const {format} =  require('date-fns');
const bcrypt = require('bcrypt');
const { render } = require('ejs');

const getRegisterController = async (req, res) => {

    if (req.session.authenticated) return res.redirect('/');

    const header = await htmlTags.findOne({tag:'header'});

    return res.render(path.join('..', 'views', 'registerUser'), {
        header:header.code
    })

}

const postRegisterController = async (req, res) => {

    try{

        if (req.session?.authenticated) {
            console.log('You are already logged');
            return res.redirect('/');
        }
        
        if (!req.body?.inputId || !req.body?.inputName || !req.body?.inputPassword || !req.body?.inputPassword2 || !req.body?.inputEmail) return res.status(400).json({ 'message': 'error' });
    
        const { inputId, inputName, inputPassword, inputPassword2, inputEmail } = req.body;
    
        if (inputPassword != inputPassword2) throw Error('Passwords are differents');
    
        const duplicateLogin = await users.findOne({ login: inputId });
    
        if (duplicateLogin) throw Error('User already exists');
    
        const duplicateEmail = await users.findOne({ email: inputEmail });
    
        if (duplicateEmail) throw Error('email already exists');
    
        const hashedPassword = await bcrypt.hash(inputPassword, 10);
        const dateNow = `${format(new Date(),'MM/dd/yyyy HH:mm:ss')}`;
    
        const result = await users.create({
            'login': inputId,
            'name':inputName,
            'password': hashedPassword,
            'email': inputEmail,
            'role': 55,
            'creationData':dateNow
        })
    
        console.log('The count has successfully been created');
        return res.status(200).redirect('/')
    
    }catch(errorMessage){

        const header = await htmlTags.findOne({tag:'header'});
        
        return res.render(path.join('..','views','registerUser'),{
            header:header.code,
            error:errorMessage
        })

    }
    
}

module.exports = { getRegisterController, postRegisterController }