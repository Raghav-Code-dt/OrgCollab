const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        maxLength : 100
    },
    email:{
        type: String,
        required:true,
        maxLength : 100,
        unique: true
    },
    password:{
        type: String,
        required:true,
        maxLength : 100
    },
    role:{
        type : String,
        enum : ["Normal","Admin","Moderators"],
        required : true,
        default : "Normal"
    },
    UserCreatedAt : Date,
    passwordCreatedAt: Date,
    lastLoginAt: Date,
    staus : {
        type : Number,
        required : true,
        enum : [0,1,2],             // {0 for inactive , 1 for active}
        default : 1
    },
    resetPassWordToken: String,
    resetPassWordTimeLimit: Date,
    // Projects : [{                                    // only store at one place
    //     ProjectId : {
    //         type : mongoose.Schema.Types.ObjectId,
    //         ref : Project,
    //         required : true
    //     },
    //     role : {
    //         type: String,
    //         enum: ["admin", "member"],
    //         default: "member"
    //     }
    // }]
},{timestamps : true})

exports.User = mongoose.model('User',UserSchema);

// Many to many to Users