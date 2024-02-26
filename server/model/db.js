const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)

//Book Model

const bookSchema = mongoose.Schema({
    bookName:String,
    bookId:Number,
    numberOfCopies:Number,
})

const Book = mongoose.model('Book', bookSchema)

//Member Model

const memberSchema  = mongoose.Schema({
    memberId:Number,
    memberName:String,

})

const Member = mongoose.model('Member', memberSchema)

const circulationSchema = mongoose.Schema({
    member:{ type: mongoose.Schema.Types.ObjectId,ref:'member'},
    book:{ type: mongoose.Schema.Types.ObjectId,ref:'book'},
    checkOutDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        default: () => Date.now() + 7*24*60*60*1000

    },
    fineAmount:{
        type:Number,
        default: 0
    },
    returned:{
        type:Boolean,
        default:false
    }
})

const Circulation = mongoose.model('Circulation',circulationSchema)

module.exports={Book,Member,Circulation}   
