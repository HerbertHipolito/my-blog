const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogPostSchema = new Schema({

    authorLogin:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    dataPost:{
        type:Date,
        required:true
    },
    comments:{
        type:Object,
        required:false
    },
    tags:{
        type:String,
        required:true
    },
    like:{
        type:Number,
        required:false,
        default:0
    },
    disLike:{
        type:Number,
        required:false,
        default:0
    },image:{
        data:Buffer,
        contentType:String
    }
});


module.exports = mongoose.model('blogPost',blogPostSchema);