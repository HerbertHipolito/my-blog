const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({

    authorName:{
        type:String,
        required:true,
    },blogId:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    dataComment:{
        type:Date,
        required:true
    },
    comments:{
        type:Object,
        required:false
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
    }
});


module.exports = mongoose.model('comment',commentSchema);