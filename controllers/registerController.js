const path = require('path');
const htmlTags = require('../model/htmlTags');
const users = require('../model/user');
const {format} =  require('date-fns');
const bcrypt = require('bcrypt');

const getRegisterController = async (req, res) => {

    const tag = await htmlTags.findOne({ tag: 'register' })

    let header = null
    req.session.authenticated ? header = await htmlTags.findOne({tag:'headerLogged'}) : header = await htmlTags.findOne({tag:'header'});

    if (!tag) return res.status(400).json({ 'message': 'error' });

    return res.render(path.join('..', 'views', 'main'), {
        body: tag.code,
        header:header.code
    })

}

const postRegisterController = async (req, res) => {

    if (req.session?.authenticated) {
        console.log('You are already logged');
        return res.redirect('/');
    }
    
    if (!req.body?.inputId || !req.body?.inputName || !req.body?.inputPassword || !req.body?.inputPassword2 || !req.body?.inputEmail) return res.status(400).json({ 'message': 'error' });

    const { inputId, inputName, inputPassword, inputPassword2, inputEmail } = req.body;

    if (inputPassword != inputPassword2) return res.status(400).json({ 'message': 'Passwords are differents' });

    const duplicateLogin = await users.findOne({ login: inputId });

    if (duplicateLogin) return res.status(409).json({ 'message': 'User already exists' });

    const duplicateEmail = await users.findOne({ email: inputEmail });

    if (duplicateEmail) return res.status(409).json({ 'message': 'Email already exists' });

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

}

module.exports = { getRegisterController, postRegisterController }