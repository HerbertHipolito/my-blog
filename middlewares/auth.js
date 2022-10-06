require('dotenv').config();
const path = require('path');

const isAuthUser = (req,res,next) =>{
    (req.session.authenticated )? next(): res.status(400).json({'message':'unauthorized access'});

}

const isAuthAdmin = (req,res,next) =>{
    (req.session.authenticated )? next(): res.status(400).json({'message':'unauthorized access'});
}


module.exports = {isAuthUser,isAuthAdmin}